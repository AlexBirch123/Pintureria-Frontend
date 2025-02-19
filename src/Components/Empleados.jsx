import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";


const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [sortedOrder, setSortedOrder] = useState(false);
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: "" });
  const nombreRef = useRef(null);
  const sueldoRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/Employees", {credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setEmpleados(local.datos);
            setLocalStorage(data, "employees");
            setFilteredEmpleados(data);
            setEmpleados(data);
          });
      } catch (error) {
        setEmpleados(local.datos);
      }
    };

    fetchEmp();
  }, []);

  const searchEmp = (dni) => {
    const emp = empleados.find((e) => e.dni === dni);
    return emp;
  };

  // Crear empleado
  const createEmp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const salary = Number(sueldoRef.current?.value);
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
    if (name && dni && salary) {
      const existingEmp = searchEmp(dni); //verifica que el DNI no exista
      if (!existingEmp) {
        const newEmp = {
          name: name,
          salary: salary,
          phone: phone,
          dni: dni,
        };
        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/Employees", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmp),
          });
          if (res.ok) {
            const completeEmp = await res.json();
            setEmpleados([...empleados, completeEmp]);
            setFilteredEmpleados([...filteredEmpleados, completeEmp]);
            setLocalStorage(empleados, "employees");
            resetForm();
            setMessage("Empleado creado con éxito");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else setMessage("DNI ya registrado");
    } else {
      setMessage("Todos los campos deben estar completos");
      setTimeout(() => setMessage(null), 3000);
    }

    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    if (nombreRef.current) nombreRef.current.value = "";
    if (sueldoRef.current) sueldoRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
    if (dniRef.current) dniRef.current.value = "";
  };

  // Función para eliminar empleado
  const deleteEmpleado = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este empleado?"
    );
    if (confirmDelete) {
      await fetch(process.env.REACT_APP_API_URL + `/Employees/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      const updatedEmp = empleados.filter((e) => e.id !== id);
      setEmpleados(updatedEmp);
      setFilteredEmpleados(updatedEmp);
      setLocalStorage(updatedEmp, "employees");
    }
  };

  const handleDoubleClick = (id, field, value) => {
    setEditingField({ id, field });
    setPrevValue(value);
  };

  const handleFieldChange = (id, field, value) => {
    const newList = empleados.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    setEmpleados(newList);
    setFilteredEmpleados(newList);
  }
  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "address") {
      const empExists = searchEmp(value);
      if (empExists && empExists.id !== id) {
        alert("La direccion ya existe.");
        handleFieldChange(id, field, prevValue);
        return setPrevValue(null);
      }
    }
    try {
      await fetch(process.env.REACT_APP_API_URL + `/Employees/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLocalStorage(empleados, "employees");
      setEditingField({ id: null, field: null });
    } catch (error) {
      console.log(error);
    }
  };

  const input = (arr, field, value) => {
    return (
      <td
        onDoubleClick={() => handleDoubleClick(arr.id, field, value)}
        title="Doble click para editar"
      >
        {editingField.id === arr.id && editingField.field === field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(arr.id, field, e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleBlur(arr.id, field, value);
              }
            }}
            autoFocus
          />
        ) : (
          value
        )}
      </td>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredEmpleados(
      empleados.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.dni.toString().includes(search.trim()) ||
          c.phone.toString().includes(search.trim())
      )
    );
  }

  const sortList = (field) => {
    if(sortedOrder){
      const sorted = [...filteredEmpleados].sort((a, b) => {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
          return 0;
        });
        setFilteredEmpleados(sorted);
    }else{
      const sorted = [...filteredEmpleados].sort((a, b) => {
        if (a[field] > b[field]) return -1;
        if (a[field] < b[field]) return 1;
        return 0;
      });
      setFilteredEmpleados(sorted);
    };
  }

  return (
    <div style={{ marginTop: "5%", marginLeft: "1%", marginRight: "1%" }}>
      <div
        className="d-flex justify-content-between mb-3"
        style={{ marginTop: "20px" }}
      >
        <input
          type="text"
          placeholder="Buscar empleado..."
          className="form-control w-25"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(search);
              handleSearch(e);
            }
          }}
        />
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear Empleado"}
        </button>
      </div>

      {/* Formulario visible para crear o editar empleado */}
      {formVisible && (
        <div className="card p-4 mb-4">
        <h3 className="text-center">Registro de Empleado</h3>
        <form onSubmit={createEmp}>
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input type="text" ref={nombreRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">DNI:</label>
            <input type="text" ref={dniRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Sueldo:</label>
            <input type="number" ref={sueldoRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono:</label>
            <input type="text" ref={telefonoRef} className="form-control" />
          </div>
          <button type="submit" className="btn btn-success w-100">Guardar</button>
        </form>
      </div>
      )}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Empleados */}
      <div className="table-responsive">
        <h2>Listado de Empleados</h2>
        <table className="table table-bordered" id="empleadoTable">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>
                ID</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("name");}}
                style={{ cursor: "pointer" }}>Nombre</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("dni");}}
                style={{ cursor: "pointer" }}>DNI</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("salary");}}
                style={{ cursor: "pointer" }}>Sueldo</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("phone");}}
                style={{ cursor: "pointer" }}>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmpleados.length > 0 ? (
              filteredEmpleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  {input(emp, "name", emp.name)}
                  {input(emp, "dni", emp.dni)}
                  {input(emp, "salary", emp.salary)}
                  {input(emp, "phone", emp.phone)}
                  <td>
                    <button
                      onClick={() => deleteEmpleado(emp.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No hay empleados registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;
