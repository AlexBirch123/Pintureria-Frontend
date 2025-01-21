import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";

const VerVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);
  const [showRows, setShowRows] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [rowsSale, setRowsSale] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const sucursalRef = useRef(null);
  const totalRef = useRef(null);

  //SOLO PARA MOSTRAR LOS DATOS DE LA VENTA
  //AL HACER DOBLE CLICK EN UNA VENTA SE MUESTRA 
  //LOS PRODUCTOS DE LA VENTA EN UNA NUEVA VENTANA 


  const fetchProd = async () => {
    try {
      await fetch(URL + "/Products")
        .then((res) => res.json())
        .then((data) => {
          setProductos(data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        await fetch(URL + "/Employees")
          .then((res) => res.json())
          .then((data) => {
            setEmpleados(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchClient = async () => {
      try {
        await fetch(URL + "/Clients")
          .then((res) => res.json())
          .then((data) => {
            setClientes(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSuc = async () => {
      try {
        await fetch(URL + "/Branches")
          .then((res) => res.json())
          .then((data) => {
            setSucursales(data);
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

  const deleteRow = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/allRows/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("error al crear las filas");
      return;
    }
    const updatedRows = rowsSale.filter((r) => r.id !== id);
    setRowsSale(updatedRows);
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
    setEditingVenta(null); // Resetear venta en edición
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
    // const venta = ventas.find((v) => v.codigo === codigo);
    // if (venta) {
    //   setFormVisible(true);
    //   setEditingVenta(venta);
    //   if (codigoRef.current) codigoRef.current.value = venta.codigo;
    //   if (clienteRef.current)
    //     clienteRef.current.value =
    //       clientesEjemplo.find((cliente) => cliente.nombre === venta.cliente)
    //         ?.id || "";
    //   if (empleadoRef.current)
    //     empleadoRef.current.value =
    //       empleadosEjemplo.find(
    //         (empleado) => empleado.nombre === venta.empleado
    //       )?.id || "";
    //   if (regionRef.current) regionRef.current.value = venta.region;
    //   if (totalRef.current) totalRef.current.value = venta.total;
    // }
  };

  // Función para eliminar venta
  const deleteVenta = async (id) => {
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
      rowsSale.forEach((r) => sumarStock(r.idProduct, r.amount));

      setVentas(updatedVentas);
      setRowsSale(null);
      setShowRows(false);
    }
  };

  const CheckboxChange = (idProducto) => {
    const estaSeleccionado = renglones.find((prod) => prod.id === idProducto);
    if (estaSeleccionado) {
      // Si ya está en el array, quítalo (desmarcar checkbox)
      renglones = renglones.filter((prod) => prod.id !== idProducto);
    } else {
      // Si no está en el array, agrégalo con cantidad inicial de 1
      renglones.push({ id: idProducto, cantidad: 1 });
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
      {formVisible && (
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
                  {cliente.name}
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
                  {empleado.name}
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
                  {suc.id}
                </option>
              ))}
            </select>
          </div>
          <div>
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
          </div>
          <button type="submit" className="btn btn-primary">
            {editingVenta ? "Actualizar Venta" : "Guardar Venta"}
          </button>
        </form>
      )}

      {tableVisible && (
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
      )}
      {/* Tabla de Ventas */}
    </div>
  );
};

export default VerVentas;
