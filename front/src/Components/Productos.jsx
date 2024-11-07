import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


// Clase Producto adaptada a JS
class Producto {
  constructor(id, nombre, precio) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
  }
}

const Productos = ({ role }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [productoEditando, setProductoEditando] = useState(null);

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    resetForm(); // Limpiar los campos del formulario
  };

  const resetForm = () => {
    setNombre('');
    setPrecio('');
    setProductoEditando(null);
  };

  const createOrUpdateProducto = (event) => {
    event.preventDefault();

    if (nombre && precio !== '') {
      if (productoEditando) {
        // Actualizar producto
        const productosActualizados = productos.map((prod) =>
          prod.id === productoEditando.id ? { ...prod, nombre, precio: Number(precio) } : prod
        );
        setProductos(productosActualizados);
      } else {
        // Crear nuevo producto
        const newProducto = new Producto(productos.length + 1, nombre, Number(precio));
        setProductos([...productos, newProducto]);
      }

      resetForm();
      setFormVisible(false);
    }
  };

  const handleEdit = (id) => {
    const producto = productos.find((prod) => prod.id === id);
    if (producto) {
      setProductoEditando(producto);
      setFormVisible(true); // Mostrar el formulario para editar
      setNombre(producto.nombre);
      setPrecio(producto.precio);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto?");
    if (confirmDelete) {
      const productosActualizados = productos.filter((producto) => producto.id !== id);
      setProductos(productosActualizados);
    }
  };

  return (
    <div >
      {(role === 'Administrador' || role === 'Vendedor') && (
        <div className="btn-group">
          <button
            id="b_create"
            onClick={toggleFormVisibility}
            type="button"
            className="btn btn-primary"
          >
            {formVisible ? 'Cancelar' : 'Crear Producto'}
          </button>
        </div>
      )}

      {/* Formulario solo visible si formVisible es true */}
      {formVisible && (
        <form onSubmit={createOrUpdateProducto} id="productoData" style={{ marginTop: '20px' }}>
          <div className="mb-3">
            <label htmlFor="nombre">Nombre: </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              name="nombre"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio">Precio: </label>
            <input
              type="number"
              value={precio === '' ? '' : precio} // Asegura que el campo pueda estar vacío
              onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
              name="precio"
              className="form-control"
              required
            />
          </div>

          {/* Botón de enviar (Crear/Actualizar Producto) */}
          <button type="submit" className="btn btn-primary">
            {productoEditando ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      {/* Tabla de productos */}
      <div className="table-responsive" style={{ marginTop: '10%' }}>
        <h2>Listado de Productos</h2>
        <table className="table table-bordered" id="productoTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.precio}</td>
                  <td>
                    {(role === 'Administrador' || role === 'Vendedor') && (
                      <>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(producto.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(producto.id)}
                          style={{ marginLeft: '10px' }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">No hay productos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;







