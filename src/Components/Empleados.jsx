import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isRequired, setIsRequired] = useState(true);
  const nombreRef = useRef(null);
  const sueldoRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        await fetch("http://localhost:8080/allEmployees")
          .then((res) => res.json())
          .then((data) => {
            setEmpleados(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmp();
  }, []);

  const searchEmp = (dni) => {
    const emp = empleados.find((e) => e.dni === dni);
    return emp;
  };

  // Crear o actualizar cliente
  const createUpdateEmp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const salary = Number(sueldoRef.current?.value);
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
    if (editingEmployee) {
      // Actualizar cliente existente
      let datos = {};
      if (name) datos.name = name;
      if (salary) datos.salary = salary;
      if (phone) datos.phone = phone;
      if (dni) datos.dni = dni;
      try {
        const res = await fetch(
          `http://localhost:8080/allEmployees/${editingEmployee.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          }
        );
        if (res.ok) {
          if (datos.name) editingEmployee.name = datos.name;
          if (datos.salary) editingEmployee.salary = datos.salary;
          if (datos.phone) editingEmployee.phone = datos.phone;
          if (datos.dni) editingEmployee.dni = datos.dni;
          const updatedEmp = empleados.map((emp) =>
            emp.id === editingEmployee.id
              ? { ...empleados, editingEmployee }
              : emp
          );
          setEmpleados(updatedEmp); //actualiza la lista con los datos actualizados
          setIsRequired(true);
          setEditingEmployee(null);
          resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (name && dni && salary) {
      const existingEmp = searchEmp(dni); //verifica que el DNI no exista
      if (!existingEmp) {
        // Crear nuevo cliente
        const newEmp = {
          name: name,
          salary: salary,
          phone: phone,
          dni: dni,
        };
        try {
          const res = await fetch("http://localhost:8080/allEmployees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmp),
          });
          if (res.ok) {
            const completeEmp = await res.json();
            setEmpleados([...empleados, completeEmp]);
            resetForm();
            setEditingEmployee(null);
          }
        } catch (error) {
          console.log(error);
        }
      } else console.log("DNI ya registrado");
    } else console.log("error al crear o actualizar Empleado");

    setFormVisible(false);
  };
  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingEmployee(null); // Resetear empleado en edición
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
      await fetch(`http://localhost:8080/allEmployees/${id}`, {
        method: "DELETE",
      });
      const updatedEmp = empleados.filter((e) => e.id !== id);
      setEmpleados(updatedEmp);
    }
  };

  return (
    <div style={{ marginTop: "5%" }}>
      <div className="btn-group" style={{ marginBottom: "3%" }}>
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
        <form
          id="empleadoForm"
          onSubmit={createUpdateEmp}
          style={{ marginTop: "5%" }}
        >
          <div className="mb-3">
            <label htmlFor="Nombre" className="form-label">
              Nombre:
            </label>
            <input
              type="text"
              ref={nombreRef}
              name="Nombre"
              className="form-control"
              required={isRequired}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Cargo" className="form-label">
              sueldo:
            </label>
            <input
              type="number"
              ref={sueldoRef}
              name="Cargo"
              className="form-control"
              required={isRequired}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Telefono" className="form-label">
              Teléfono:
            </label>
            <input
              type="text"
              ref={telefonoRef}
              name="Telefono"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="DNI" className="form-label">
              DNI:
            </label>
            <input
              type="text"
              ref={dniRef}
              name="DNI"
              className="form-control"
              required={isRequired}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingEmployee ? "Actualizar Empleado" : "Guardar Empleado"}
          </button>
        </form>
      )}

      {/* Tabla de Empleados */}
      <div className="table-responsive">
        <h2>Listado de Empleados</h2>
        <table className="table table-bordered" id="empleadoTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Sueldo</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.id}</td>
                  <td>{empleado.name}</td>
                  <td>{empleado.salary}</td>
                  <td>{empleado.phone}</td>
                  <td>{empleado.dni}</td>
                  <td>
                    <button
                      onClick={() => {
                        toggleFormVisibility();
                        setEditingEmployee(empleado);
                        setIsRequired(false);
                      }}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => deleteEmpleado(empleado.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay empleados registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;
