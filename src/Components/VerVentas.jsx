import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { searchDesc } from "../utils/search";
import { useNavigate } from "react-router";

const VerVentas = () => {
  const navigate = useNavigate() 
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState("");
  const [showRows, setShowRows] = useState(false);
  const [rowsSale, setRowsSale] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);


  useEffect(() => {
    const fetchSale = async () => {
      const local = getLocalStorage("sales");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/sales", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            if (!data) return setVentas(local.datos);
            setVentas(data);
            setFilteredVentas(data);
            setLocalStorage(data, "sales");
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/employees", { credentials: "include" })
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
        await fetch(process.env.REACT_APP_API_URL + "/clients", { credentials: "include" })
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
    fetchClient();
    fetchEmp();
    fetchSale();
  }, []);

  
  const cargaFilasVenta = async (id) => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + `/rows/${id}`, { credentials: "include" });
      const data = await res.json();
      if(data.length === 0) return console.log("No hay productos en esta venta");
      setRowsSale(data);
      console.log(data);
      console.log(rowsSale);
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
      await fetch(process.env.REACT_APP_API_URL + `/sales/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updatedVentas = ventas.filter((v) => v.id !== id);
      cargaFilasVenta(id);
      setVentas(updatedVentas);
      setFilteredVentas(updatedVentas);
      setShowRows(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredVentas(
      empleados.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.dni.toString().includes(search.trim()) ||
          c.phone.toString().includes(search.trim())
      )
    );
  }

  const sortList = (field) => {
    if(sortedOrder){
      const sorted = [...filteredVentas].sort((a, b) => {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
          return 0;
        });
        setFilteredVentas(sorted);
    }else{
      const sorted = [...filteredVentas].sort((a, b) => {
        if (a[field] > b[field]) return -1;
        if (a[field] < b[field]) return 1;
        return 0;
      });
      setFilteredVentas(sorted);
    };
  }

  const handleDate = (date) => { 
    const fecha = new Date(date);
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return (fecha.toLocaleString('es-ES', opciones));
  }


  return (
    <div style={{ marginTop: "5%", marginLeft: "1%", marginRight: "1%" }}>
      <div className="d-flex justify-content-between mb-1">
      <div className="d-flex align-items-center mb-3" style={{ flex: 0.25 }}>
          <input
            type="text"
            placeholder="Buscar cliente, usuario, empleado..."
            className="form-control"
            style={{ width: "100%" }}
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
          
        </div>
        <div className="d-flex flex-column align-items-end mb-3">
          <input
            type="date"
            className="form-control mb-1"
            onChange={(e) => {
              const selectedDate = e.target.value;
              setFilteredVentas(
                ventas.filter((venta) =>
                  venta.createdAt.startsWith(selectedDate)
                )
              );
            }}
          />
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setFilteredVentas(ventas);
            }}
          >
            Reset
          </button>
          <button
            id="b_create"
            onClick={()=>navigate("/crear_ventas")}
            style={{marginTop:"1%"}}
            type="button"
            className="btn btn-primary mb-2"
          >
            Crear venta
          </button>
        </div>
      </div>
      <h2 className="text-center mb-4">Listado de Ventas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");
                }}
                style={{ cursor: "pointer" }}>ID
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idClient");
                }}
                style={{ cursor: "pointer" }}>Cliente
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idUser");
                }}
                style={{ cursor: "pointer" }}>Usuario
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idEmp");
                }}
                style={{ cursor: "pointer" }}>Empleado
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("idBranch");
                }}
                style={{ cursor: "pointer" }}>Sucursal
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("createdAt");
                }}
                style={{ cursor: "pointer" }}>Fecha
              </th>
              <th
                onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("total");
                }}
                style={{ cursor: "pointer" }}>Total
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.length > 0 ? (
              filteredVentas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{searchDesc(clientes, venta.idClient, "name") || "-"}</td>
                  <td>{venta.idUser || "-"}</td>
                  <td>{searchDesc(empleados, venta.idEmp, "name")}</td>
                  <td>{venta.idBranch}</td>
                  <td>{handleDate(venta.createdAt)}</td>
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
                      Abrir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No hay ventas registradas
                </td>
              </tr>
            )}

            {showRows && (
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Detalles de la Venta</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowRows(false)}
                      ></button>
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
                          {rowsSale.length > 0 ?(
                          rowsSale.map((row) => (
                            <tr key={row.id}>
                              <td>{row.title}</td>
                              <td>{row.price}</td>
                              <td>{row.quantity}</td>
                              <td>{row.total}</td>
                            </tr>
                          ))):(
                            <tr>
                              <td colSpan={4} className="text-center">Error al obtener los productos de la venta</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowRows(false)}
                      >
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
    </div>
  );
};

export default VerVentas;
