import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { searchDesc } from "../utils/search";

const VerVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [showRows, setShowRows] = useState(false);
  const [rowsSale, setRowsSale] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  //SOLO PARA MOSTRAR LOS DATOS DE LA VENTA
  //AL HACER DOBLE CLICK EN UNA VENTA SE MUESTRA
  //LOS PRODUCTOS DE LA VENTA EN UNA NUEVA VENTANA

  useEffect(() => {
    const fetchSale = async () => {
      const local = getLocalStorage("sales");
      try {
        await fetch(URL + "/Sales", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setVentas(local.datos);
            setVentas(data);
            setLocalStorage(data, "sales");
          });
      } catch (error) {
        console.log(error);
      }
    };

    // const fetchProd = async () => {
    //   const local = getLocalStorage("products");

    //   try {
    //     await fetch(URL + "/Products", { credentials: "include" })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         if (!data) return setProductos(local.datos);
    //         setProductos(data);
    //         setLocalStorage(data, "products");
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(URL + "/Employees", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setEmpleados(local.datos);
            setEmpleados(data);
            setLocalStorage(data, "employees");
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchClient = async () => {
      const local = getLocalStorage("clients");
      try {
        await fetch(URL + "/Clients", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setClientes(local.datos);
            setClientes(data);
            setLocalStorage(data, "clients");
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSuc = async () => {
      const local = getLocalStorage("clients");
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

    // fetchProd();
    fetchSuc();
    fetchClient();
    fetchEmp();
    fetchSale();
  }, []);

  
  const cargaFilasVenta = async (id) => {
    try {
      const res = await fetch(URL + `/Rows/${id}`, { credentials: "include" });
      const data = await res.json();
      setRowsSale(data);
    } catch (error) {
      console.log("error al cargar productos de venta");
    }
  };

  // Función para eliminar venta
  const deleteVenta = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta venta?"
    );
    if (confirmDelete) {
      await fetch(URL + `/Sales/${id}`, {
        method: "DELETE",
      });
      const updatedVentas = ventas.filter((v) => v.id !== id);
      cargaFilasVenta(id);
      setVentas(updatedVentas);
      setShowRows(false);
    }
  };

  return (
    <div style={{ marginTop: "5%" }}>
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
                  <td>{searchDesc(clientes,venta.idClient,"name")}</td>
                  <td>{searchDesc(empleados,venta.idEmp,"name")}</td>
                  <td>{venta.idBranch}</td>
                  <td>{venta.createdAt}</td>
                  <td>${venta.total}</td>
                  <td>
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
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalles de la Venta</h5>
                    <button type="button" className="btn-close" onClick={() => setShowRows(false)}></button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered">
                      <thead className="table-dark">
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowsSale.map((row) => (
                          <tr key={row.id}>
                            <td>{row.description}</td>
                            <td>{row.price}</td>
                            <td>{row.amount}</td>
                            <td>{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowRows(false)}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </tbody>
        </table>
      </div>
      {/* Tabla de Ventas */}
    </div>
  );
};

export default VerVentas;
