import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [prevValue, setPrevValue] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", dni: "" });


  useEffect(() => {

  const fetchClients = async () => {
    const local = getLocalStorage("clients");
    try {
      await fetch(process.env.REACT_APP_API_URL + "/clients",{credentials: "include"})
        .then((res) => res.json())
        .then((data) => {
          if (!data) return setClients(local.datos);;
          setClients(data);
          setFilteredClients(data);
          setLocalStorage(data, "clients");
        });
    } catch (error) {
      setClients(local.datos);
    }
  };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const searchClient = (dni) => {
    const client = clients.find((c) => c.dni === dni);
    return client;
  };

  // Crear cliente
  const createClient = async (event) => {
    event.preventDefault();
    const { name, address, phone, dni } = formData;
    if (name && dni) {
      const existingClient = searchClient(dni); //verifica que el DNI no exista
      if (!existingClient) {
        // Crear nuevo cliente
        const newClient = {
          name: name,
          address: address,
          phone: phone,
          dni: dni,
        };
        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/clients", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newClient),
          });
          if (res.ok) {
            const completeClient = await res.json();
            const newClients = [...clients, completeClient];
            setClients(newClients);
            setFilteredClients(newClients);
            setLocalStorage(newClients, "clients");
            resetForm();
            setMessage("Cliente creado exitosamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("error al crear el cliente")
        }
      } else setMessage("DNI ya registrado");
    }

    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({ name: "", address: "", phone: "", dni: "" })
  };

  // Función para eliminar cliente
  const deleteCliente = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );
    if (confirmDelete) {
      try {
        await fetch(process.env.REACT_APP_API_URL + `/clients/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const updatedClients = clients.filter((client) => client.id !== id);
        setClients(updatedClients);
        setFilteredClients(updatedClients); 
        setLocalStorage(updatedClients, "clients");
      } catch (error) {
        setMessage("Error al eliminar cliente");
      }
    }
    setTimeout(() =>  setMessage(null),3000)
  };

  const handleDoubleClick = (id, field,value) => {
    setEditingField({ id, field });
    setPrevValue(value)
  };

  const handleFieldChange = (id, field, value) => {
    const newList = clients.map((cli) =>
      cli.id === id ? { ...cli, [field]: value } : cli
    );
    setFilteredClients(newList);
    setClients(newList);
  };

  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "dni") {
      const dniExists = searchClient(value);
      if (dniExists && dniExists.id !== id) {
        alert("El DNI ya existe.");
        handleFieldChange(id, field, prevValue);
        return setPrevValue(null);
      }
    }
    try {
      await fetch(process.env.REACT_APP_API_URL + `/clients/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLocalStorage(clients, "clients");
      setEditingField({ id: null, field: null });
    } catch (error) {
      setMessage("error al editar el cliente")
    }
    searchClient(value);
    setTimeout(() =>  setMessage(null),3000)
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
    setFilteredClients(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.dni.toString().includes(search.trim()) ||
          c.address.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.phone.toString().includes(search.trim())
      )
    );
  }

  const sortList = (field) => {
      if(sortedOrder){
        const sorted = [...filteredClients].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
          });
          setFilteredClients(sorted);
      }else{
        const sorted = [...filteredClients].sort((a, b) => {
          if (a[field] > b[field]) return -1;
          if (a[field] < b[field]) return 1;
          return 0;
        });
        setFilteredClients(sorted);
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
          placeholder="Buscar cliente..."
          className="form-control w-25"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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
          {formVisible ? "Cancelar" : "Crear Cliente"}
        </button>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {/* Formulario visible para crear o editar cliente */}
      {formVisible && (
        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3">Nuevo Cliente</h4>
          <form
            id="clienteForm"
            onSubmit={createClient}
            style={{ marginTop: "5%" }}
          >
            <div className="mb-3">
              <label htmlFor="Nombre" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                name="Nombre"
                className="form-control"
                required={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dni" className="form-label">
                DNI:
              </label>
              <input
                onChange={handleChange}
                type="text"
                value={formData.dni}
                name="dni"
                className="form-control"
                required={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Direccion" className="form-label">
                Dirección:
              </label>
              <input
                onChange={handleChange}
                type="text"
                value={formData.address}
                name="Direccion"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Telefono" className="form-label">
                Teléfono:
              </label>
              <input
                onChange={handleChange}
                type="text"
                value={formData.phone}
                name="Telefono"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      {/* Tabla de Clientes */}
      <div className="table-responsive">
        <h2>Listado de Clientes</h2>
        <table className="table table-striped table-hover" id="clienteTable">
          <thead className="table-dark">
            <tr>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>
                ID
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("name");}}
                style={{ cursor: "pointer" }}>
                Nombre
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("dni");}}
                style={{ cursor: "pointer" }}>
                DNI
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("address");}}
                style={{ cursor: "pointer" }}>
                Dirección
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("phone");}}
                style={{ cursor: "pointer" }}>
                Teléfono
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  {input(cliente, "name", cliente.name)}
                  {input(cliente, "dni", cliente.dni)}
                  {input(cliente, "address", cliente.address)}
                  {input(cliente, "phone", cliente.phone)}
                  <td>
                    <button
                      onClick={() => deleteCliente(cliente.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay clients registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
