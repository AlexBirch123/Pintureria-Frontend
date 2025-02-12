import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const cuitRef = useRef(null);

  useEffect(() => {
    const fetchSupp = async () => {
      const local = getLocalStorage("branches");
      
        try {
          await fetch(process.env.REACT_APP_API_URL + "/Suppliers",{credentials: "include"})
            .then((res) => res.json())
            .then((data) => {
              if (!data) return setProveedores(local.datos);
              setProveedores(data);
              setLocalStorage(data, "suppliers");
            });
        } catch (error) {
          setProveedores(local.datos);
        }
      };

    fetchSupp();
  }, []);

  const searchSupp = (cuit) => {
    const client = proveedores.find((p) => p.cuit === cuit);
    return client;
  };

  // Crear proveedor
  const createUpdateSupp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const cuit = Number(cuitRef.current?.value);
    
    if (name && cuit) {
      const existingSupp = searchSupp(cuit); //verifica que el CUIT no exista
      if (!existingSupp) {
        const newSupp = {
          name: name,
          address: address,
          phone: phone,
          cuit: cuit,
        };
        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/Suppliers", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSupp),
          });
          if (res.ok) {
            const completeSupp = await res.json();
            setProveedores([...proveedores, completeSupp]);
            setLocalStorage([...proveedores, completeSupp], "suppliers");
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else console.log("CUIT/CUIL ya registrado");
    } else console.log("error al crear o actualizar proveedores");

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
    if (cuitRef.current) cuitRef.current.value = "";
  };

  // Función para eliminar proveedor
  const deleteProveedor = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );
    if (confirmDelete) {
      await fetch(process.env.REACT_APP_API_URL + `/Suppliers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updatedSupp = proveedores.filter((p) => p.id !== id);
      setProveedores(updatedSupp);
    }
  };

    const handleDoubleClick = (id, field, value) => {
      setEditingField({ id, field });
      setPrevValue(value);
    };
  
    const handleFieldChange = (id, field, value) => {
      setProveedores((prevProv) =>
        prevProv.map((prov) =>
          prov.id === id ? { ...prov, [field]: value } : prov
        )
      );
    };
  
    const handleBlur = async (id, field, value) => {
      const data = { [field]: value };
      if (field === "address") {
        const addressExists = searchSupp(value);
        if (addressExists && addressExists.id !== id) {
          alert("La direccion ya existe.");
          setProveedores((prevProv) =>
            prevProv.map((prov) =>
              prov.id === id ? { ...prov, [field]: prevValue } : prov
            )
          );
          return setPrevValue(null);
        }
      }
      try {
        await fetch(process.env.REACT_APP_API_URL + `/Suppliers/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        setLocalStorage(proveedores, "suppliers");
        setEditingField({ id: null, field: null });
      } catch (error) {
        setMessage("Error en la solicitud");
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

  return (
    <div style={{ marginTop: "8%" }}>
      <div className="btn-group" style={{ marginBottom: "3%" }}>
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear Proveedor"}
        </button>
      </div>

      {/* Formulario visible para crear o editar proveedor */}
      {formVisible && (
        <form
          id="proveedorForm"
          onSubmit={createUpdateSupp}
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
            <label htmlFor="cuit" className="form-label">
              CUIT/CUIL:
            </label>
            <input
              type="text"
              ref={cuitRef}
              name="cuit"
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
            Guardar Proveedor
          </button>
        </form>
      )}

      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Proveedores */}
      <div className="table-responsive">
        <h2>Listado de Proveedores</h2>
        <table className="table table-bordered" id="proveedorTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>CUIT/CUIL</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.id}</td>
                  {input(prov,"name", prov.name)}
                  {input(prov,"cuit", prov.cuit)}
                  {input(prov,"phone", prov.phone)}
                  {input(prov,"address", prov.address)}
                  <td>
                    <button
                      onClick={() => deleteProveedor(prov.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay proveedores registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
