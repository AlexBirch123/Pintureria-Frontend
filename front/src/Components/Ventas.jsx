import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simulamos algunos datos de ejemplo para clientes y empleados
const clientesEjemplo = [
  { id: 1, nombre: 'Cliente A' },
  { id: 2, nombre: 'Cliente B' },
  { id: 3, nombre: 'Cliente C' },
];

const empleadosEjemplo = [
  { id: 1, nombre: 'Empleado X' },
  { id: 2, nombre: 'Empleado Y' },
  { id: 3, nombre: 'Empleado Z' },
];

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const codigoRef = useRef(null);
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const regionRef = useRef(null);
  const totalRef = useRef(null);

  // Crear venta
  const createVenta = (event) => {
    event.preventDefault();
    const codigo = codigoRef.current?.value;
    const clienteId = clienteRef.current?.value;
    const empleadoId = empleadoRef.current?.value;
    const region = regionRef.current?.value;
    const total = parseFloat(totalRef.current?.value);

    if (codigo && clienteId && empleadoId && region && !isNaN(total)) {
      const clienteSeleccionado = clientesEjemplo.find(cliente => cliente.id === parseInt(clienteId));
      const empleadoSeleccionado = empleadosEjemplo.find(empleado => empleado.id === parseInt(empleadoId));

      if (editingVenta) {
        // Actualizar venta existente
        const updatedVentas = ventas.map((venta) =>
          venta.codigo === editingVenta.codigo
            ? { ...venta, cliente: clienteSeleccionado.nombre, empleado: empleadoSeleccionado.nombre, region, total }
            : venta
        );
        setVentas(updatedVentas);
        setEditingVenta(null);
      } else {
        // Crear nueva venta
        const newVenta = {
          codigo,
          cliente: clienteSeleccionado.nombre,
          empleado: empleadoSeleccionado.nombre,
          region,
          total,
        };
        setVentas([...ventas, newVenta]);
      }
      resetForm();
      setFormVisible(false); // Ocultar formulario después de crear o actualizar venta
    }
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingVenta(null); // Resetear venta en edición
  };

  // Limpiar formulario
  const resetForm = () => {
    if (codigoRef.current) codigoRef.current.value = '';
    if (clienteRef.current) clienteRef.current.value = '';
    if (empleadoRef.current) empleadoRef.current.value = '';
    if (regionRef.current) regionRef.current.value = '';
    if (totalRef.current) totalRef.current.value = '';
  };

  // Función para actualizar venta
  const editVenta = (codigo) => {
    const venta = ventas.find((v) => v.codigo === codigo);
    if (venta) {
      setFormVisible(true);
      setEditingVenta(venta);
      if (codigoRef.current) codigoRef.current.value = venta.codigo;
      if (clienteRef.current) clienteRef.current.value = clientesEjemplo.find(cliente => cliente.nombre === venta.cliente)?.id || '';
      if (empleadoRef.current) empleadoRef.current.value = empleadosEjemplo.find(empleado => empleado.nombre === venta.empleado)?.id || '';
      if (regionRef.current) regionRef.current.value = venta.region;
      if (totalRef.current) totalRef.current.value = venta.total;
    }
  };

  // Función para eliminar venta
  const deleteVenta = (codigo) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta venta?");
    if (confirmDelete) {
      const updatedVentas = ventas.filter((venta) => venta.codigo !== codigo);
      setVentas(updatedVentas);
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
          {formVisible ? 'Cancelar' : 'Crear Venta'}
        </button>
      </div>

      {/* Formulario visible para crear o editar venta */}
      {formVisible && (
        <form id="ventaForm" onSubmit={createVenta} style={{ marginTop: '5%' }}>
          <div className="mb-3">
            <label htmlFor="Codigo" className="form-label">Código de Venta:</label>
            <input type="text" ref={codigoRef} name="Codigo" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="Cliente" className="form-label">Cliente:</label>
            <select ref={clienteRef} name="Cliente" className="form-control" required>
              <option value="">Seleccione un cliente</option>
              {clientesEjemplo.map(cliente => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Empleado" className="form-label">Empleado:</label>
            <select ref={empleadoRef} name="Empleado" className="form-control" required>
              <option value="">Seleccione un empleado</option>
              {empleadosEjemplo.map(empleado => (
                <option key={empleado.id} value={empleado.id}>{empleado.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Region" className="form-label">Región:</label>
            <input type="text" ref={regionRef} name="Region" className="form-control" required />
          </div>
          <div className="mb-3">
            <label htmlFor="Total" className="form-label">Total:</label>
            <input type="number" ref={totalRef} name="Total" className="form-control" step="0.01" required />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingVenta ? 'Actualizar Venta' : 'Guardar Venta'}
          </button>
        </form>
      )}

      {/* Tabla de Ventas */}
      <div className="table-responsive">
        <h2>Listado de Ventas</h2>
        <table className="table table-bordered" id="ventaTable">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Región</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr key={venta.codigo}>
                  <td>{venta.codigo}</td>
                  <td>{venta.cliente}</td>
                  <td>{venta.empleado}</td>
                  <td>{venta.region}</td>
                  <td>{venta.total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => editVenta(venta.codigo)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => deleteVenta(venta.codigo)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay ventas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ventas;
