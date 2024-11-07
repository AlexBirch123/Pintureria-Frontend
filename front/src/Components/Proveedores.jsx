import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  // Crear proveedor
  const createProveedor = (event) => {
    event.preventDefault();
    const nombre = nombreRef.current?.value;
    const direccion = direccionRef.current?.value;
    const telefono = telefonoRef.current?.value;
    const dni = dniRef.current?.value;

    if (nombre && direccion && telefono && dni) {
      if (editingProveedor) {
        // Actualizar proveedor existente
        const updatedProveedores = proveedores.map((proveedor) =>
          proveedor.id === editingProveedor.id
            ? { ...proveedor, nombre, direccion, telefono, dni }
            : proveedor
        );
        setProveedores(updatedProveedores);
        setEditingProveedor(null);
      } else {
        // Crear nuevo proveedor
        const newProveedor = {
          id: Date.now(), // Generación de ID única
          nombre,
          direccion,
          telefono,
          dni,
        };
        setProveedores([...proveedores, newProveedor]);
      }
      resetForm();
      setFormVisible(false); // Ocultar formulario después de crear o actualizar proveedor
    }
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingProveedor(null); // Resetear proveedor en edición
  };

  // Limpiar formulario
  const resetForm = () => {
    if (nombreRef.current) nombreRef.current.value = '';
    if (direccionRef.current) direccionRef.current.value = '';
    if (telefonoRef.current) telefonoRef.current.value = '';
    if (dniRef.current) dniRef.current.value = '';
  };

  // Función para actualizar proveedor
  const editProveedor = (id) => {
    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) {
      setFormVisible(true);
      setEditingProveedor(proveedor);
      if (nombreRef.current) nombreRef.current.value = proveedor.nombre;
      if (direccionRef.current) direccionRef.current.value = proveedor.direccion;
      if (telefonoRef.current) telefonoRef.current.value = proveedor.telefono;
      if (dniRef.current) dniRef.current.value = proveedor.dni;
    }
  };

  // Función para eliminar proveedor
  const deleteProveedor = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este proveedor?");
    if (confirmDelete) {
      const updatedProveedores = proveedores.filter((proveedor) => proveedor.id !== id);
      setProveedores(updatedProveedores);
    }
  };

  return (
    <div style={{ marginTop: '5%' }}>
      <div className="btn-group" style={{ marginBottom: '3%' }}>
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? 'Cancelar' : 'Crear Proveedor'}
        </button>
      </div>

      {/* Formulario visible para crear o editar proveedor */}
      {formVisible && (
        <form id="proveedorForm" onSubmit={createProveedor} style={{ marginTop: '5%' }}>
          <div className="mb-3">
            <label htmlFor="Nombre" className="form-label">Nombre:</label>
            <input type="text" ref={nombreRef} name="Nombre" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="Direccion" className="form-label">Dirección:</label>
            <input type="text" ref={direccionRef} name="Direccion" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="Telefono" className="form-label">Teléfono:</label>
            <input type="text" ref={telefonoRef} name="Telefono" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="DNI" className="form-label">DNI:</label>
            <input type="text" ref={dniRef} name="DNI" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingProveedor ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
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
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.dni}</td>
                  <td>
                    <button
                      onClick={() => editProveedor(proveedor.id)}
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
