import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [prevValue, setPrevValue] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState(false);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {

  const fetchClients = async () => {
    const local = getLocalStorage("clients");
    try {
      await fetch(process.env.REACT_APP_API_URL + "/Clients",{credentials: "include"})
        .then((res) => res.json())
        .then((data) => {
          if (!data) return setClientes(local.datos);;
          setClientes(data);
          setFilteredClients(data);
          setLocalStorage(data, "clients");
        });
    } catch (error) {
      console.log(error);
      setClientes(local.datos);
    }
  };

    fetchClients();
  }, []);

  const searchClient = (dni) => {
    const client = clientes.find((c) => c.dni === dni);
    return client;
  };

  // Crear cliente
  const createClient = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
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
          const res = await fetch(process.env.REACT_APP_API_URL + "/Clients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newClient),
          });
          if (res.ok) {
            const completeClient = await res.json();
            const newClients = [...clientes, completeClient];
            setClientes(newClients);
            setFilteredClients(newClients);
            setLocalStorage(newClients, "clients");
            resetForm();
            setMessage("Cliente creado exitosamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
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
    if (nombreRef.current) nombreRef.current.value = "";
    if (direccionRef.current) direccionRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
    if (dniRef.current) dniRef.current.value = "";
  };

  // Función para eliminar cliente
  const deleteCliente = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );
    if (confirmDelete) {
      try {
        await fetch(process.env.REACT_APP_API_URL + `/Clients/${id}`, {
          method: "DELETE",
        });
        const updatedClients = clientes.filter((client) => client.id !== id);
        setClientes(updatedClients);
        setFilteredClients(updatedClients); 
        setLocalStorage(updatedClients, "clients");
      } catch (error) {
        setMessage("Error al eliminar cliente");
      }
    }
  };

  const handleDoubleClick = (id, field,value) => {
    setEditingField({ id, field });
    setPrevValue(value)
  };

  const handleFieldChange = (id, field, value) => {
    const newList = clientes.map((cli) =>
      cli.id === id ? { ...cli, [field]: value } : cli
    );
    setFilteredClients(newList);
    setClientes(newList);
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
      await fetch(process.env.REACT_APP_API_URL + `/Clients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLocalStorage(clientes, "clients");
      setEditingField({ id: null, field: null });
    } catch (error) {
      console.log(error);
    }
    searchClient(value);
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
      clientes.filter(
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
                ref={nombreRef}
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
                type="text"
                ref={dniRef}
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
                type="text"
                ref={direccionRef}
                name="Direccion"
                className="form-control"
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
                  No hay clientes registrados
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
