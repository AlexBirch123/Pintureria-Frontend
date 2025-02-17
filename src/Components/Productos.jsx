import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {setLocalStorage,getLocalStorage} from "../utils/localStorage"
import { searchDesc } from "../utils/search";

const Productos = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setcategorias] = useState([]);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState("");
  const descripcionRef = useRef(null);
  const titleRef = useRef(null);
  const idProvRef = useRef(null);
  const idCatRef = useRef(null);
  const stockRef = useRef(null);
  const precioRef = useRef(null);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/Products", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setProductos(local.datos);
            setProductos(data);
            setFilteredProductos(data);
            setLocalStorage(data, "products");
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchcat = async () => {
      const local = getLocalStorage("category");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/category", { credentials: "include" })
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
        await fetch(process.env.REACT_APP_API_URL + "/Suppliers", { credentials: "include" })
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
    if (titleRef.current) titleRef.current.value = "";
  };

  const createOrUpdateProducto = async (event) => {
    event.preventDefault();
    const description = descripcionRef.current?.value;
    const price = Number(precioRef.current?.value);
    const stock = Number(stockRef.current?.value);
    const idProv = Number(idProvRef.current?.value);
    const idCat = Number(idCatRef.current?.value);
    const title = titleRef.current?.value
    if (title && price && idProv && idCat && stock) {
      const newProd = {
        description: description,
        price: price,
        stock: stock,
        idProv: idProv,
        idCat: idCat,
      };
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/Products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProd),
        });
        if (res.ok) {
          const completeProd = await res.json();
          setProductos([...productos, completeProd]);
          setFilteredProductos([...productos, completeProd]);
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
      await fetch(process.env.REACT_APP_API_URL + `/Products/${id}`, {
        credentials: true,
        method: "DELETE",
      });
      const updatedProd = productos.filter((p) => p.id !== id);
      setProductos(updatedProd);
      setFilteredProductos(updatedProd);
      setLocalStorage(updatedProd);
    }
  };
    const handleDoubleClick = (id, field, value) => {
      setEditingField({ id, field });
    };
  
    const handleFieldChange = (id, field, value) => {
      const newList = productos.map((prod) =>
        prod.id === id ? { ...prod, [field]: value } : prod
      )
      setProductos(newList);
      setFilteredProductos(newList);
    };
  
    const handleBlur = async (id, field, value) => {
      const data = { [field]: value };
      try {
        await fetch(process.env.REACT_APP_API_URL + `/Products/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        setLocalStorage(productos, "products");
        setEditingField({ id: null, field: null });
      } catch (error) {
        setMessage("Error en la solicitud");
      }
    };

  const input = (pr, field, value) => {
    return (
      <td
        onDoubleClick={() => handleDoubleClick(pr.id, field, value)}
        title="Doble click para editar"
      >
        {editingField.id === pr.id && editingField.field === field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(pr.id, field, e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleBlur(pr.id, field, value);
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
    if(search.trim() === "")return setFilteredProductos(productos);
    filteredProductos(
      proveedores.filter(
        (c) =>c.title.toLowerCase().includes(search.toLowerCase().trim()))
    );
  }

  const sortList = (field) => {
      if(sortedOrder){
        const sorted = [...filteredProductos].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
          });
          setFilteredProductos(sorted);
      }else{
        const sorted = [...filteredProductos].sort((a, b) => {
          if (a[field] > b[field]) return -1;
          if (a[field] < b[field]) return 1;
          return 0;
        });
        setFilteredProductos(sorted);
      };
  }

  return (
    <div style={{ marginLeft: "1%", marginRight: "1%", marginTop: "5%" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="w-25">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="form-control w-100"
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
          <select name="idProv" id="idProv" 
            className="form-select mt-2"
            onChange={(e) => {
              if (e.target.value === "") {
                setFilteredProductos(productos);
              } else {
                const filtered = productos.filter(
                  (p) => p.idProv === Number(e.target.value)
                );
                setFilteredProductos(filtered);
              }
            }}>
            <option value="">Todos</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          <select name="idCat" id="idCat" 
            className="form-select mt-2"
            onChange={(e) => {
              if (e.target.value === "") {
                setFilteredProductos(productos);
              } else {
                const filtered = productos.filter(
                  (p) => p.idCat === Number(e.target.value)
                );
                setFilteredProductos(filtered);
              }
            }}>
            <option value="">Todos</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.description}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-column align-items-end">
          <button
            id="b_create"
            onClick={toggleFormVisibility}
            type="button"
            className="btn btn-primary mb-2"
          >
            {formVisible ? "Cancelar" : "Crear Producto"}
          </button>
          <button
            onClick={() => (window.location.href = "/products")}
            type="button"
            className="btn btn-primary"
          >
            Vista de tienda
          </button>
        </div>
      </div>
      <div>
        {formVisible && (
          <form
            onSubmit={createOrUpdateProducto}
            id="productoData"
            className="mt-3 p-3 border rounded bg-light "
          >
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  ref={descripcionRef}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Precio:</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  ref={precioRef}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Stock:</label>
                <input type="number" className="form-control" ref={stockRef} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Proveedor:</label>
                <select className="form-select" required ref={idProvRef}>
                  <option value="">Elegir proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría:</label>
                <select className="form-select" required ref={idCatRef}>
                  <option value="">Elegir categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 text-end">
              <button type="submit" className="btn btn-primary me-2">
                Crear
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleFormVisibility}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabla de productos */}
      <div className="table-responsive mt-4" style={{ marginTop: "5%" }}>
        <h2 className="fs-4">Listado de Productos</h2>
        <table className="table table-sm table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("title");}}
                style={{ cursor: "pointer" }}>Titulo</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("price");}}
                style={{ cursor: "pointer" }}>Precio</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("stock");}}
                style={{ cursor: "pointer" }}>Stock</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idProv");}}
                style={{ cursor: "pointer" }}>Proveedor</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idCat");}}
                style={{ cursor: "pointer" }}>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length > 0 ? (
              filteredProductos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td className="text-truncate">
                    {input(producto, "title", producto.title)}
                  </td>
                  <td>{input(producto, "price", producto.price)}</td>
                  <td>{input(producto, "stock", producto.stock)}</td>
                  <td>
                    {
                      searchDesc(proveedores,producto.idProv,"name")
                    }
                  </td>
                  <td>
                    {searchDesc(categorias, producto.idCat, "description")}
                  </td>
                  <td>
                    <>
                      <button
                        className="btn btn-danger btn-sm mx-1"
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
                <td colSpan={7} className="text-center text-muted">
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
