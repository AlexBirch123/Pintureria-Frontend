import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [required, setIsRequired] = useState(true);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const cuitRef = useRef(null);

  useEffect(() => {
    const fetchSupp = async () => {
      try {
        await fetch("http://localhost:8080/allSuppliers")
          .then((res) => res.json())
          .then((data) => {
            setProveedores(data);
          });
      } catch (error) {
        console.log(error);
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

    if (editingProveedor) {
      // Actualizar cliente existente
      let datos = {};
      if (name) datos.name = name;
      if (address) datos.address = address;
      if (phone) datos.phone = phone;
      if (cuit) datos.cuit = cuit;
      try {
        const res = await fetch(
          `http://localhost:8080/allSuppliers/${editingProveedor.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          }
        );
        if (res.ok) {
          if (datos.name) editingProveedor.name = datos.name;
          if (datos.address) editingProveedor.address = datos.address;
          if (datos.phone) editingProveedor.phone = datos.phone;
          if (datos.cuit) editingProveedor.cuit = datos.cuit;
          const updatedSupp = proveedores.map((supp) =>
            supp.id === editingProveedor.id
              ? { ...proveedores, updatedSupp }
              : supp
          );
          setProveedores(updatedSupp); //actualiza la lista con los datos actualizados
          setIsRequired(true);
          setEditingProveedor(null);
          // sethidden(!dniHidden);
          resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (name && cuit) {
      const existingSupp = searchSupp(cuit); //verifica que el DNI no exista
      if (!existingSupp) {
        // Crear nuevo cliente
        const newSupp = {
          name: name,
          address: address,
          phone: phone,
          cuit: cuit,
        };
        try {
          const res = await fetch("http://localhost:8080/allSuppliers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSupp),
          });
          if (res.ok) {
            const completeSupp = await res.json();
            setProveedores([...proveedores, completeSupp]);
            resetForm();
            setEditingProveedor(null);
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
    setEditingProveedor(null); // Resetear proveedor en edición
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
      await fetch(`http://localhost:8080/allSuppliers/${id}`, {
        method: "DELETE",
      });
      const updatedSupp = proveedores.filter((p) => p.id !== id);
      setProveedores(updatedSupp);
    }
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
              required={required}
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
            <label htmlFor="DNI" className="form-label">
              CUIT/CUIL:
            </label>
            <input
              type="text"
              ref={cuitRef}
              name="cuit"
              className="form-control"
              required={required}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingProveedor ? "Actualizar Proveedor" : "Guardar Proveedor"}
          </button>
        </form>
      )}

      {/* Tabla de Proveedores */}
      <div className="table-responsive">
        <h2>Listado de Proveedores</h2>
        <table className="table table-bordered" id="proveedorTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>CUIT/CUIL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.name}</td>
                  <td>{proveedor.address}</td>
                  <td>{proveedor.phone}</td>
                  <td>{proveedor.cuit}</td>
                  <td>
                    <button
                      onClick={() => {
                        toggleFormVisibility();
                        setEditingProveedor(proveedor);
                        setIsRequired(false);
                      }}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => deleteProveedor(proveedor.id)}
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
