import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {getLocalStorage, setLocalStorage} from "../utils/localStorage"
import { useNavigate } from "react-router";
import { ImgProducto } from "./ImgProducto";
import { CreatCategory } from "./CreatCategory";

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
  const skuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (url, localStorageKey, setState) => {
          const local = getLocalStorage(localStorageKey);
          try {
          const res = await fetch(process.env.REACT_APP_API_URL + url, { credentials: "include" });
          if (!res.ok) return setState(local.datos);
          const data = await res.json();
          setState(data);
          setLocalStorage(data, localStorageKey);
          } catch (error) {
          console.log(error);
          setState(local.datos);
          }
        };
    fetchData("/Products", "products", setProductos);
    fetchData("/category", "category", setcategorias);
    fetchData("/Suppliers", "suppliers", setProveedores); 
  }, []);

  useEffect(()=>{
    if(productos) setFilteredProductos(productos)
  },[productos])

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
    if (skuRef.current)skuRef.current.value = "";
  };

  const createProducto = async (event) => {
    event.preventDefault();
    const description = descripcionRef.current?.value;
    const price = Number(precioRef.current?.value);
    const stock = Number(stockRef.current?.value);
    const idProv = Number(idProvRef.current?.value);
    const idCat = Number(idCatRef.current?.value);
    const title = titleRef.current?.value
    const sku = skuRef.current?.value
    if (title && price && idProv && idCat && stock) {
      const newProd = {
        sku:sku,
        title: title,
        description: description,
        price: price,
        stock: stock,
        idProv: idProv,
        idCat: idCat,
      };
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/Products", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProd),
        });
        if (res.ok) {
          const completeProd = await res.json();
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
        credentials: "include",
        method: "DELETE",
      });
      const updatedProd = productos.filter((p) => p.id !== id);
      setFilteredProductos(updatedProd);
      setLocalStorage(updatedProd);
    }
  };

    const handleDoubleClick = (id, field) => {
      setEditingField({ id, field });
    };
  
    const handleFieldChange = (id, field, value) => {
      const newList = productos.map((prod) =>
        prod.id === id ? { ...prod, [field]: value } : prod
      )
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
    setFilteredProductos(
      filteredProductos.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase().trim()) ||
        c.sku.toLowerCase().includes(search.toLowerCase().trim())
      )
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

  const handleSorted = (field)=>{
    setSortedOrder(!sortedOrder);
    sortList(field);
  }


  return (
    <div style={{ marginLeft: "1%", marginRight: "1%", marginTop: "5%" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="w-25">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="form-control w-100"
            hidden={formVisible}
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
            hidden={formVisible}
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
            <option value="" hidden={formVisible}>Proveedores</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
            </option>
            ))}
          </select>
          <select name="idCat" id="idCat" 
            className="form-select mt-2"
            hidden={formVisible}
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
            <option value="">Categorias</option>
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
            id="b_create_bulk"
            onClick={() => navigate("/import")}
            type="button"
            hidden={formVisible}
            className="btn btn-primary mb-2"
          >
            Crear en lote
          </button>
          <button
            onClick={() => navigate("/products")}
            type="button"
            hidden={formVisible}
            className="btn btn-primary"
          >
            Vista de tienda
          </button>
          <CreatCategory categorias={categorias} setcategorias={setcategorias}></CreatCategory>
        </div>
      </div>
      <div>
        {message && <div className="alert alert-info mt-3">{message}</div>}
        {formVisible && (
          <form
            onSubmit={createProducto}
            id="productoData"
            className="mt-3 p-3 border rounded bg-light "
          >
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Titulo:</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  ref={titleRef}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  ref={descripcionRef}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">SKU:</label>
                <input
                  placeholder="Codigo interno"
                  type="text"
                  className="form-control"
                  ref={skuRef}
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
                <input type="number" className="form-control" ref={stockRef} required />
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
      <div className="table-responsive mt-4" style={{ marginTop: "5%" }}>
        <h2 className="fs-4">Listado de Productos</h2>
        <table className="table table-sm table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSorted("id")}style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => handleSorted("sku")}style={{ cursor: "pointer" }}>SKU</th>
              <th>Foto</th>
              <th onClick={() => handleSorted("title")}style={{ cursor: "pointer" }}>Titulo</th>
              <th onClick={() => handleSorted("price")}style={{ cursor: "pointer" }}>Precio</th>
              <th onClick={() => handleSorted("stock")}style={{ cursor: "pointer" }}>Stock</th>
              <th onClick={() => handleSorted("idProv")}style={{ cursor: "pointer" }}>Proveedor</th>
              <th onClick={() => handleSorted("idCat")}style={{ cursor: "pointer" }}>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length > 0 ? (
              filteredProductos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.sku}</td>
                  <ImgProducto key={producto.id} producto={producto} />             
                  <td className="text-truncate">{input(producto, "title", producto.title)}</td>
                  <td>{input(producto, "price", producto.price)}</td>
                  <td>{input(producto, "stock", producto.stock)}</td>
                  <td>
                    <select className="form-select" 
                    required 
                    value={producto.idProv}
                    onChange={(e)=>{
                      handleFieldChange(producto.id, "idProv", e.target.value)
                      handleBlur(producto.id, "idProv", e.target.value)} }
                    >
                    <option value="">Elegir proveedor</option>
                    {proveedores.map((p) => (
                     <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                </td>
                <td>
                    <select className="form-select" 
                    required 
                    value={producto.idCat}
                    onChange={(e)=>{
                      handleFieldChange(producto.id,"idCat",e.target.value)
                      handleBlur(producto.id, "idCat", e.target.value)} }
                    >
                    <option value="">Elegir categoría</option>
                    {categorias.map((cat) => (
                     <option key={cat.id} value={cat.id}>
                      {cat.description}
                    </option>
                  ))}
                </select>
                </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      onClick={() => handleDelete(producto.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-muted">
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
