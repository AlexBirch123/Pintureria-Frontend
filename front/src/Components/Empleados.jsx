import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const nombreRef = useRef(null);
  const cargoRef = useRef(null);
  const telefonoRef = useRef(null);
  const dniRef = useRef(null);

  // Crear empleado
  const createEmpleado = (event) => {
    event.preventDefault();
    const nombre = nombreRef.current?.value;
    const cargo = cargoRef.current?.value;
    const telefono = telefonoRef.current?.value;
    const dni = dniRef.current?.value;

    if (nombre && cargo && telefono && dni) {
      if (editingEmployee) {
        // Actualizar empleado existente
        const updatedEmpleados = empleados.map((empleado) =>
          empleado.id === editingEmployee.id
            ? { ...empleado, nombre, cargo, telefono, dni }
            : empleado
        );
        setEmpleados(updatedEmpleados);
        setEditingEmployee(null);
      } else {
        // Crear nuevo empleado
        const newEmpleado = {
          id: Date.now(), // Generación de ID única
          nombre,
          cargo,
          telefono,
          dni,
        };
        setEmpleados([...empleados, newEmpleado]);
      }
      resetForm();
      setFormVisible(false); // Ocultar formulario después de crear o actualizar empleado
    }
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingEmployee(null); // Resetear empleado en edición
  };

  // Limpiar formulario
  const resetForm = () => {
    if (nombreRef.current) nombreRef.current.value = '';
    if (cargoRef.current) cargoRef.current.value = '';
    if (telefonoRef.current) telefonoRef.current.value = '';
    if (dniRef.current) dniRef.current.value = '';
  };

  // Función para actualizar empleado
  const editEmpleado = (id) => {
    const empleado = empleados.find((e) => e.id === id);
    if (empleado) {
      setFormVisible(true);
      setEditingEmployee(empleado);
      if (nombreRef.current) nombreRef.current.value = empleado.nombre;
      if (cargoRef.current) cargoRef.current.value = empleado.cargo;
      if (telefonoRef.current) telefonoRef.current.value = empleado.telefono;
      if (dniRef.current) dniRef.current.value = empleado.dni;
    }
  };

  // Función para eliminar empleado
  const deleteEmpleado = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este empleado?");
    if (confirmDelete) {
      const updatedEmpleados = empleados.filter((empleado) => empleado.id !== id);
      setEmpleados(updatedEmpleados);
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
          {formVisible ? 'Cancelar' : 'Crear Empleado'}
        </button>
      </div>

      {/* Formulario visible para crear o editar empleado */}
      {formVisible && (
        <form id="empleadoForm" onSubmit={createEmpleado} style={{ marginTop: '5%' }}>
          <div className="mb-3">
            <label htmlFor="Nombre" className="form-label">Nombre:</label>
            <input type="text" ref={nombreRef} name="Nombre" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="Cargo" className="form-label">Cargo:</label>
            <input type="text" ref={cargoRef} name="Cargo" className="form-control" required />
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
            {editingEmployee ? 'Actualizar Empleado' : 'Guardar Empleado'}
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
              <th>Cargo</th>
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
                  <td>{empleado.nombre}</td>
                  <td>{empleado.cargo}</td>
                  <td>{empleado.telefono}</td>
                  <td>{empleado.dni}</td>
                  <td>
                    <button
                      onClick={() => editEmpleado(empleado.id)}
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
