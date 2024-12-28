import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [isRequired, setIsRequired] = useState(true);
  const [dniHidden, sethidden] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await fetch("http://localhost:8080/allClients")
          .then((res) => res.json())
          .then((data) => {
            setClientes(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const searchClient = (dni) => {
    const client = clientes.find((c) => c.dni === dni);
    return client;
  };

  // Crear o actualizar cliente
  const createUpdateClient = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const dni = Number(dniRef.current?.value);
    if (editingClient) {
      // Actualizar cliente existente
      let datos = {};
      if (name) datos.name = name;
      if (address) datos.address = address;
      if (phone) datos.phone = phone;
      if (dni) datos.dni = dni;
      try {
        const res = await fetch(
          `http://localhost:8080/allClients/${editingClient.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          }
        );
        if (res.ok) {
          if (datos.name) editingClient.name = datos.name;
          if (datos.address) editingClient.address = datos.address;
          if (datos.phone) editingClient.phone = datos.phone;
          if (datos.dni) editingClient.dni = datos.dni;
          const updatedClientes = clientes.map((cliente) =>
            cliente.id === editingClient.id
              ? { ...clientes, editingClient }
              : cliente
          );
          console.log(editingClient);
          setClientes(updatedClientes); //actualiza la lista con los datos actualizados
          setIsRequired(true);
          setEditingClient(null);
          sethidden(!dniHidden);
          resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (name && dni) {
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
          const res = await fetch("http://localhost:8080/allClients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newClient),
          });
          if (res.ok) {
            const completeClient = await res.json();
            setClientes([...clientes, completeClient]);
            resetForm();
            setEditingClient(null);
          }
        } catch (error) {
          console.log(error);
        }
      } else console.log("DNI ya registrado");
    } else console.log("error al crear o actualizar Cliente");

    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingClient(null); // Resetear cliente en edición
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
      await fetch(`http://localhost:8080/allClients/${id}`, {
        method: "DELETE",
      });
      const updatedClients = clientes.filter((client) => client.id !== id);
      setClientes(updatedClients);
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
          {formVisible ? "Cancelar" : "Crear Cliente"}
        </button>
      </div>

      {/* Formulario visible para crear o editar cliente */}
      {formVisible && (
        <form
          id="clienteForm"
          onSubmit={createUpdateClient}
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
          <div className="mb-3">
            <label htmlFor="DNI" className="form-label" hidden={dniHidden}>
              DNI:
            </label>
            <input
              type="text"
              ref={dniRef}
              name="DNI"
              className="form-control"
              required={isRequired}
              hidden={dniHidden}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingClient ? "Actualizar Cliente" : "Guardar Cliente"}
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
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.name}</td>
                  <td>{cliente.address}</td>
                  <td>{cliente.phone}</td>
                  <td>{cliente.dni}</td>
                  <td>
                    <button
                      onClick={() => {
                        toggleFormVisibility();
                        setEditingClient(cliente);
                        setIsRequired(false);
                        sethidden(true);
                      }}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Actualizar
                    </button>
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
