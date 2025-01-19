import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [prevValue, setPrevValue] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
  // Obtener sucursales
  const fetchClients = async () => {
    const local = getLocalStorage("clients");
    try {
      await fetch(URL + "/Clients")
        .then((res) => res.json())
        .then((data) => {
          if (!data) return setClientes(local.datos);;
          setClientes(data);
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
          const res = await fetch(URL + "/Clients", {
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
        await fetch(URL + `/Clients/${id}`, {
          method: "DELETE",
        });
        const updatedClients = clientes.filter((client) => client.id !== id);
        setClientes(updatedClients);
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
    setClientes((cli) =>
      cli.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "dni") {
      const dniExists = searchClient(value);
      if (dniExists) {
        alert("El DNI ya existe.");
        setClientes((cli) =>
          cli.map((c) =>
            c.id === id ? { ...c, [field]: prevValue } : c
          )
        );
        return setPrevValue(null);
      }
    }
    try {
      await fetch(URL + `/Clients/${id}`, {
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

  return (
    <div style={{ marginTop: "5%" }}>
      <div className="btn-group" style={{ marginBottom: "3%" }}>
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
          <button type="submit" className="btn btn-primary">
            Guardar Cliente
          </button>
        </form>
      )}

      {/* Tabla de Clientes */}
      <div className="table-responsive">
        <h2>Listado de Clientes</h2>
        <table className="table table-bordered" id="clienteTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td
                    onDoubleClick={() => handleDoubleClick(cliente.id, "dni",cliente.dni)}
                    title="Doble click para editar"
                  >
                    {editingField.id === cliente.id &&
                    editingField.field === "dni" ? (
                      <input
                        type="text"
                        value={cliente.dni}
                        onChange={(e) =>
                          handleFieldChange(cliente.id, "dni", e.target.value)
                        }
                        onBlur={async () =>
                          await handleBlur(cliente.id, "dni", cliente.dni)
                        }
                        autoFocus
                      />
                    ) : (
                      cliente.dni
                    )}
                  </td>
                  <td
                    onDoubleClick={() => handleDoubleClick(cliente.id, "name",cliente.name)}
                    title="Doble click para editar"
                  >
                    {editingField.id === cliente.id &&
                    editingField.field === "name" ? (
                      <input
                        type="text"
                        value={cliente.name}
                        onChange={(e) =>
                          handleFieldChange(cliente.id, "name", e.target.value)
                        }
                        onBlur={async () =>
                          await handleBlur(cliente.id, "name", cliente.address)
                        }
                        autoFocus
                      />
                    ) : (
                      cliente.name
                    )}
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick(cliente.id, "address",cliente.address)
                    }
                    title="Doble click para editar"
                  >
                    {editingField.id === cliente.id &&
                    editingField.field === "address" ? (
                      <input
                        type="text"
                        value={cliente.address}
                        onChange={(e) =>
                          handleFieldChange(
                            cliente.id,
                            "address",
                            e.target.value
                          )
                        }
                        onBlur={async () =>
                          await handleBlur(
                            cliente.id,
                            "address",
                            cliente.address
                          )
                        }
                        autoFocus
                      />
                    ) : (
                      cliente.address
                    )}
                  </td>
                  <td
                    onDoubleClick={() => handleDoubleClick(cliente.id, "phone",cliente.phone)}
                    title="Doble click para editar"
                  >
                    {editingField.id === cliente.id &&
                    editingField.field === "phone" ? (
                      <input
                        type="text"
                        value={cliente.phone}
                        onChange={(e) =>
                          handleFieldChange(cliente.id, "phone", e.target.value)
                        }
                        onBlur={async () =>
                          await handleBlur(cliente.id, "phone", cliente.phone)
                        }
                        autoFocus
                      />
                    ) : (
                      cliente.phone
                    )}
                  </td>
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
                <td colSpan={6}>No hay clientes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
