import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import { URL } from "../utils/URL";
import BuscadorProd from "./BuscardorProd";

const Ventas = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);
  const [listProd, setListProd] = useState([]);
  const [saleProds, setSaleProds] = useState([]);
  const [rowsSale, setRowsSale] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const sucursalRef = useRef(null);
  const totalRef = useRef(null);

  //PESTAÑA PARA CREAR UNA VENTA
  //Obtener productos
  //Obtener empleados
  //Obtener clientes
  //Obtener sucursales
  //crear buscador de productos
  //agregarlos en un tabla donde se pueda modificar los campos sin guardar en la base de datos
  //al guardar se debe crear la venta y los renglones
  //al guardar se debe actualizar el stock de los productos
  //al finalzar debe mostrar el total de la venta

  const fetchProd = async () => {
    const local = getLocalStorage("products");
    try {
      await fetch(URL + "/Products", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (!data) return setProductos(local.datos);
          setProductos(data);
          setLocalStorage("products", data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(URL + "/Employees", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setEmpleados(local.datos);
            setLocalStorage(data, "employees");
            setEmpleados(data);
          });
      } catch (error) {
        setEmpleados(local.datos);
      }
    };

    const fetchClient = async () => {
      const local = getLocalStorage("clients");
      try {
        await fetch(URL + "/Clients", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setEmpleados(local.datos);
            setClientes(data);
            setLocalStorage(data, "clients");
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSuc = async () => {
      const local = getLocalStorage("branches");
      try {
        await fetch(URL + "/Branches", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setSucursales(local.datos);
            setSucursales(data);
            setLocalStorage(data, "branches");
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProd();
    fetchSuc();
    fetchClient();
    fetchEmp();
  }, []);

  const sumarStock = async (id, stock, cantidad) => {
    try {
      const datos = {
        stock: stock + cantidad,
      };
      await fetch(`http://localhost:8080/allProducts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
    } catch (error) {
      
      console.log("error al actualiza stock");
    }
  };


  const creatRows = async (datos) => {
    try {
      const res = await fetch(`http://localhost:8080/allRows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
    } catch (error) {
      console.log("error al crear las filas");
      return;
    }
  };

  const cargaFilasVenta = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/allRows/${id}`);
      const data = await res.json();
      setRowsSale(data);
      console.log(data);
      console.log(rowsSale);
    } catch (error) {
      console.log("error al actualiza stock");
    }
  };

  const updateStock = async (id, stock, cantidad) => {
    try {
      const datos = {
        stock: stock - cantidad,
      };
      await fetch(`http://localhost:8080/allProducts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
    } catch (error) {
      console.log("error al actualiza stock");
    }
  };

  let renglones = [];
  // Crear venta
  const createVenta = async (event) => {
    event.preventDefault();
    console.log(renglones);
    toggleFormVisibility();
    const idClient = clienteRef.current.value;
    const idEmp = empleadoRef.current.value;
    const idBranch = sucursalRef.current.value;

    if (idClient && idEmp && idBranch) {
      let prodFiltrados = [];
      renglones.forEach((r) => {
        productos.forEach((prod) => {
          if (prod.id === r.id) {
            prodFiltrados.push({ ...prod, cantidad: Number(r.cantidad) });
          }
        });
      });
      let total = 0;
      prodFiltrados.map((pr) => (total += pr.price * pr.cantidad));
      const newSale = {
        idClient: idClient,
        idBranch: idBranch,
        idEmp: idEmp,
        total: total,
      };
      try {
        const res = await fetch(`http://localhost:8080/allSales`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });
        if (res.ok) {
          const completeSale = await res.json();
          try {
            const rows = [];
            prodFiltrados.forEach((p) => {
              const newRow = {
                idSale: completeSale.id,
                idProduct: p.id,
                description: p.description,
                price: p.price,
                amount: p.cantidad,
                total: p.cantidad * p.price,
              };
              rows.push(newRow);
            });
            rows.forEach((row) =>
              //carga los productos de la venta
              creatRows(row)
            );

            prodFiltrados.forEach((p) =>
              updateStock(p.id, p.stock, p.cantidad)
            );
          } catch (error) {
            console.log(" erro al crear la venta", error);
          }
          setVentas([...ventas, completeSale]);
          resetForm();
          // setEditingClient(null);
        }
      } catch (error) {
        console.log(" erro al crear la venta", error);
      }
    }
    fetchProd();
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setTableVisible(!tableVisible);
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    if (clienteRef.current) clienteRef.current.value = "";
    if (empleadoRef.current) empleadoRef.current.value = "";
    if (sucursalRef.current) sucursalRef.current.value = "";
    if (totalRef.current) totalRef.current.value = "";
  };

  // Función para actualizar venta
  const editVenta = (codigo) => {
   
  };

  // Función para eliminar venta
  const handleDeleteRow = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta venta?"
    );
    if (confirmDelete) {
      await fetch(`http://localhost:8080/allSales/${id}`, {
        method: "DELETE",
      });
      await fetch(`http://localhost:8080/allRows/sale/${id}`, {
        method: "DELETE",
      });
      const updatedVentas = ventas.filter((v) => v.id !== id);
      cargaFilasVenta(id);
      rowsSale.forEach((r) => sumarStock(r.idProduct, r.amount))
 
      setRowsSale(null);
    }
  };

  const CantidadChange = (idProducto, cantidad) => {
    const estaSeleccionado = renglones.find((prod) => prod.id === idProducto);
    if (estaSeleccionado) {
      // Si ya está en el array, quítalo (desmarcar checkbox)
      const index = renglones.findIndex((prod) => prod.id == idProducto);
      renglones[index].cantidad = Number(cantidad);
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
          {formVisible ? "Cancelar" : "Crear Venta"}
        </button>
      </div>

      {/* Formulario visible para crear o editar venta */}
        <form id="ventaForm" onSubmit={createVenta} style={{ marginTop: "5%" }}>
          <div className="mb-3">
            <label htmlFor="Cliente" className="form-label">
              Cliente:
            </label>
            <select
              ref={clienteRef}
              name="Cliente"
              className="form-control"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.id + " - " + cliente.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Empleado" className="form-label">
              Empleado:
            </label>
            <select
              ref={empleadoRef}
              name="Empleado"
              className="form-control"
              required
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.id + " - " + empleado.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="sucursal" className="form-label">
              Sucursal:
            </label>
            <select
              ref={sucursalRef}
              name="sucursal"
              className="form-control"
              required
            >
              <option value="">Seleccione una Sucursal</option>
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  {suc.id + " - " + suc.address}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
          <table className="table table-bordered" id="ventaTable">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Descripcion</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {saleProds.map((producto) => (
                  <tr key={producto.id}>
                    <td style={{ width: "100px" }}>
                      {/* <input
                        type="checkbox"
                        className="btn-check"
                        id={`btncheck-${producto.id}`}
                        onChange={() => CheckboxChange(producto.id)}
                      /> */}
                      <label
                        className="btn btn-outline-primary"
                        htmlFor={`btncheck-${producto.id}`}
                      >
                        Seleccionar
                      </label>
                    </td>
                    <td style={{ width: "100px" }}>
                      <input
                        type="number"
                        name="cantidad"
                        className="form-control"
                        onChange={(e) =>
                          CantidadChange(producto.id, e.target.value)
                        }
                        min="1"
                      />
                    </td>
                    <td>{producto.description}</td>
                    <td>{producto.price}</td>
                    <td>{producto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              <BuscadorProd saleProds={saleProds} setSaleProds ={setSaleProds}></BuscadorProd>
          </div>
          {/* <div>
            <label htmlFor="Productos" className="form-label">
              Productos Disponibles:
            </label>
            <table className="table table-bordered" id="ventaTable">
              <thead className="table-dark">
                <tr>
                  <th></th>
                  <th>Cantidad</th>
                  <th>Descripcion</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td style={{ width: "100px" }}>
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={`btncheck-${producto.id}`}
                        onChange={() => CheckboxChange(producto.id)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor={`btncheck-${producto.id}`}
                      >
                        Seleccionar
                      </label>
                    </td>
                    <td style={{ width: "100px" }}>
                      <input
                        type="number"
                        name="cantidad"
                        className="form-control"
                        onChange={(e) =>
                          CantidadChange(producto.id, e.target.value)
                        }
                        min="1"
                      />
                    </td>
                    <td>{producto.description}</td>
                    <td>{producto.price}</td>
                    <td>{producto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <button type="submit" className="btn btn-primary">
            Guardar Venta
          </button>
        </form>
      

      {/* {tableVisible && (
        <div className="table-responsive">
          <h2>Listado de Ventas</h2>
          <table className="table table-bordered" id="ventaTable">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Empleado</th>
                <th>Sucursal</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.id}</td>
                    <td>{venta.idClient}</td>
                    <td>{venta.idEmp}</td>
                    <td>{venta.idBranch}</td>
                    <td>{venta.createdAt}</td>
                    <td>${venta.total}</td>
                    <td>
                      <button
                        onClick={() => editVenta(venta.codigo)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => deleteVenta(venta.id)}
                        className="btn btn-danger btn-sm me-2"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => {
                          cargaFilasVenta(venta.id);
                          setShowRows(!showRows);
                        }}
                        className="btn btn-info btn-sm "
                      >
                        {showRows ? "Cerrar" : "Abrir"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No hay ventas registradas</td>
                </tr>
              )}
              {showRows && (
                <table className="table table-bordered" id="ventaTable">
                  <thead className="table-dark">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsSale.map((row) => (
                      <tr key={row.id}>
                        <td>{row.description}</td>
                        <td>{row.price}</td>
                        <td>{row.amount}</td>
                        <td>{row.total}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => deleteRow(row.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </tbody>
          </table>
        </div>
      )} */}
      {/* Tabla de Ventas */}
    </div>
  );
};

export default Ventas;
