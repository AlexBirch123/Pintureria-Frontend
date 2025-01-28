import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import {setLocalStorage,getLocalStorage} from "../utils/localStorage"


const Productos = ({ role }) => {
  const [formVisible, setFormVisible] = useState(false);

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setcategorias] = useState([]);

  const descripcionRef = useRef(null);
  const idProvRef = useRef(null);
  const idCatRef = useRef(null);
  const stockRef = useRef(null);
  const precioRef = useRef(null);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(URL + "/Products", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setProductos(local.datos);
            setProductos(data);
            setLocalStorage(data, "products");
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchcat = async () => {
      const local = getLocalStorage("category");
      try {
        await fetch(URL + "/category", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setcategorias(local.datos);
            setcategorias(data);
            setLocalStorage(data, "category");
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSupp = async () => {
      const local = getLocalStorage("suppliers");
      try {
        await fetch(URL + "/Suppliers", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setProveedores(local.datos);
            setProveedores(data);
            setLocalStorage(data, "suppliers");
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchcat();
    fetchProd();
    fetchSupp();
  }, []);

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    resetForm(); // Limpiar los campos del formulario
  };

  const resetForm = () => {
    if (descripcionRef.current) descripcionRef.current.value = "";
    if (stockRef.current) stockRef.current.value = "";
    if (precioRef.current) precioRef.current.value = "";
    if (idProvRef.current) idProvRef.current.value = "";
  };

  const createOrUpdateProducto = async (event) => {
    event.preventDefault();
    const description = descripcionRef.current?.value;
    const price = Number(precioRef.current?.value);
    const stock = Number(stockRef.current?.value);
    const idProv = Number(idProvRef.current?.value);
    const idCat = Number(idCatRef.current?.value);
    if (description && price && idProv) {
      // Crear nuevo cliente
      const newProd = {
        description: description,
        price: price,
        stock: stock,
        idProv: idProv,
        idCat: idCat,
      };
      try {
        const res = await fetch(URL + "/Products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProd),
        });
        if (res.ok) {
          const completeProd = await res.json();
          setProductos([...productos, completeProd]);
          resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    } else console.log("error al crear o actualizar producto");

    setFormVisible(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (confirmDelete) {
      await fetch(URL + `/Products/${id}`, {
        credentials: true,
        method: "DELETE",
      });
      const updatedProd = productos.filter((p) => p.id !== id);
      setProductos(updatedProd);
      setLocalStorage(updatedProd);
    }
  };

  const descripcionCat = (id) => {
    const cat = categorias.find((c) => c.id === id);
    return cat.description;
  };
  const descripcionProv = (id) => {
    const prov = proveedores.find((p) => p.id === id);

    return prov.name;
  };

  return (
    <div style={{ marginTop: "8%" }}>
      {(role === 1 || role === 2) && (
        <div className="btn-group">
          <button
            id="b_create"
            onClick={toggleFormVisibility}
            type="button"
            className="btn btn-primary"
          >
            {formVisible ? "Cancelar" : "Crear Producto"}
          </button>
        </div>
      )}
      {/* <div>

          <button onClick={alert("vista de cliente")}>
            Vista cliente
          </button>
      </div> */}

      {/* Formulario solo visible si formVisible es true */}
      {formVisible && (
        <form
          onSubmit={createOrUpdateProducto}
          id="productoData"
          style={{ marginTop: "20px" }}
        >
          <div className="mb-3">
            <label htmlFor="nombre">Descripcion: </label>
            <input
              type="text"
              name="descripcion"
              className="form-control"
              required
              ref={descripcionRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio">Precio: </label>
            <input
              type="number"
              name="precio"
              className="form-control"
              required
              ref={precioRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nombre">stock: </label>
            <input
              type="number"
              ref={stockRef}
              name="stock"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nombre">Proveedor: </label>
            <select
              name="idProv"
              id="idProv"
              style={{ marginLeft: "10px" }}
              className="form-control"
              required
              ref={idProvRef}
            >
              <option value="">Elegi un proveedor</option>
              {proveedores.map((prov) => (
                <option value={prov.id}>
                  {prov.id}-{prov.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="nombre">Categoria: </label>
            <select
              name="idCat"
              id="idCat"
              style={{ marginLeft: "10px" }}
              className="form-control"
              required
              ref={idCatRef}
            >
              <option value="">Elegi categoria</option>
              {categorias.map((cat) => (
                <option value={cat.id}>
                  {" "}
                  {cat.id}-{cat.description}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Crear producto
          </button>
        </form>
      )}

      {/* Tabla de productos */}
      <div className="table-responsive" style={{ marginTop: "10%" }}>
        <h2>Listado de Productos</h2>
        <table className="table table-bordered" id="productoTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Descipcion</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Proveedor</th>
              <th>Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.description}</td>
                  <td>${producto.price}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.idProv}</td> {/* poner el nombre del prov */}
                  <td>{descripcionCat(producto.idCat)}</td>
                  <td>
                    <>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {}}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(producto.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Eliminar
                      </button>
                    </>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;
