import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [filteredSucursales, setFilteredSucursales] = useState([]);
  const [search, setSearch] = useState([]);
  const [sortedOrder, setSortedOrder] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);

  // Obtener sucursales al cargar el componente
  useEffect(() => {
    const fetchBranches = async () => {
      const local = getLocalStorage("branches");

      try {
        await fetch(process.env.REACT_APP_API_URL + "/Branches",{credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setSucursales(local.datos);
            setSucursales(data);
            setFilteredSucursales(data);
            setLocalStorage(data, "branches");
          });
      } catch (error) {
        setSucursales(local.datos);
      }
    };
    fetchBranches();
  }, []);

  const searchBranch = (address) => {
    const branch = sucursales.find((s) => s.address === address);
    return branch;
  };

  // Crear sucursal
  const createSucursal = async (event) => {
    event.preventDefault();
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    if (phone && address) {
      const existingBranch = searchBranch(address);
      if (!existingBranch) {
        const newBranch = {
          address: address,
          phone: phone,
        };

        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/Branches", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newBranch),
          });
          if (res.ok) {
            const completeBranch = await res.json();
            setSucursales([...sucursales, completeBranch]); // Actualiza la lista de productos con el nuevo
            setLocalStorage([...sucursales, completeBranch], "branches");
            setFilteredSucursales([...sucursales, completeBranch]);
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("Error en la solicitud");
        }
      } else setMessage("La sucursal ya existe");
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
    if (direccionRef.current) direccionRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
  };

  // Función para eliminar sucursal
  const deleteSucursal = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sucursal?"
    );
    if (confirmDelete) {
      try {
        await fetch(process.env.REACT_APP_API_URL + `/Branches/${id}`, {
          method: "DELETE",
        });
        const updatedSucursales = sucursales.filter(
          (sucursal) => sucursal.id !== id
        );
        setSucursales(updatedSucursales);
        setLocalStorage(updatedSucursales);
        setFilteredSucursales(updatedSucursales);
      } catch (error) {
        setMessage("Error al eliminar la sucursal");
      }
    }
  };

  const handleDoubleClick = (id, field, value) => {
    setEditingField({ id, field });
    setPrevValue(value);
  };

  const handleFieldChange = (id, field, value) => {
    const newList = sucursales.map((sucursal) =>
      sucursal.id === id ? { ...sucursal, [field]: value } : sucursal
    )
    setSucursales(newList);
    setFilteredSucursales(newList);
  };

  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "address") {
      const addressExists = searchBranch(value);
      if (addressExists && addressExists.id !== id) {
        alert("La direccion ya existe.");
        handleFieldChange(id, field, prevValue);
        return setPrevValue(null);
      }
    }
    try {
      await fetch(process.env.REACT_APP_API_URL + `/Branches/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLocalStorage(sucursales, "branches");
      setEditingField({ id: null, field: null });
    } catch (error) {
      setMessage("Error en la solicitud");
    }
  };

  const input = (suc, field, value) => {
    return (
      <td
        onDoubleClick={() => handleDoubleClick(suc.id, field, value)}
        title="Doble click para editar"
      >
        {editingField.id === suc.id && editingField.field === field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(suc.id, field, e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleBlur(suc.id, field, value);
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
    setFilteredSucursales(
      sucursales.filter(
        (c) =>
          c.address.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.phone.toString().includes(search.trim())
      )
    );
  }

  const sortList = (field) => {
      if(sortedOrder){
        const sorted = [...filteredSucursales].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
          });
          setFilteredSucursales(sorted);
      }else{
        const sorted = [...filteredSucursales].sort((a, b) => {
          if (a[field] > b[field]) return -1;
          if (a[field] < b[field]) return 1;
          return 0;
        });
        setFilteredSucursales(sorted);
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
          placeholder="Buscar sucursal..."
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
          {formVisible ? "Cancelar" : "Crear Sucursal"}
        </button>
      </div>

      {/* Formulario visible para crear o editar sucursal */}
      {formVisible && (
        <div className="card p-4 shadow-sm mb-4">
        <form onSubmit={createSucursal}>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input type="text" ref={direccionRef} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input type="text" ref={telefonoRef} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-success w-100">Guardar</button>
        </form>
      </div>
      )}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Sucursales */}
      <div className="table-responsive"> 
        <h2 className="mt-4">Listado de Sucursales</h2>
        <table className="table table-bordered" id="sucursalTable">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("address");}}
                style={{ cursor: "pointer" }}>Dirección</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("phone");}}
                style={{ cursor: "pointer" }}>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSucursales.length > 0 ? (
              filteredSucursales.map((sucursal) => (
                <tr key={sucursal.id}>
                  <td>{sucursal.id}</td>
                  <td>{input(sucursal,"address", sucursal.address)}</td>
                  <td>{input(sucursal,"phone", sucursal.phone)}</td>
                  <td>
                    <button
                      onClick={() => deleteSucursal(sucursal.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">No hay sucursales registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sucursales;
