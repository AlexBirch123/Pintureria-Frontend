import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import BuscadorProd from "./BuscardorProd";


const CrearVentas = () => {
  const [saleProds, setSaleProds] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const sucursalRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchProd = async () => {
      const local = getLocalStorage("products");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/Products", { credentials: "include" })
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
    const fetchEmp = async () => {
      const local = getLocalStorage("employees");
      try {
        await fetch(process.env.REACT_APP_API_URL + "/Employees", { credentials: "include" })
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
        await fetch(process.env.REACT_APP_API_URL + "/Clients", { credentials: "include" })
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
        await fetch(process.env.REACT_APP_API_URL + "/Branches", { credentials: "include" })
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

  useEffect(() => {
    const deleteRow = (id) => {
      setSaleProds((saleProds) => saleProds.filter((s) => s.idProduct !== id));
    };
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedProductId !== null) {
        deleteRow(selectedProductId);
        setSelectedProductId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProductId]);

  // Crear venta
  const creatSale = async (e) => {
    e.preventDefault();
    const idClient = clienteRef.current.value;
    const idEmp = empleadoRef.current.value;
    const idBranch = sucursalRef.current.value;

    if (idClient && idEmp && idBranch) {
      let total = 0;
      saleProds.map((prod) => (total = total + (prod.price * prod.quantity)));
      const newSale = {
        idClient: idClient,
        idBranch: idBranch,
        idEmp: idEmp,
        total: total,
        saleProds: saleProds,
      };
      if (!(total > 0))
        return console.log(
          "El total de la venta debe ser mayor a 0"
        ); /*setMessage("El total de la venta debe ser mayor a 0");*/
      try {
        await fetch(process.env.REACT_APP_API_URL + `/Sales`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });
      } catch (error) {
        console.log(" error al crear la venta", error);
      }
      setSaleProds([]);
      setTimeout(setMessage(null), 3000);
    }
    resetForm();
  };

  // Limpiar formulario
  const resetForm = () => {
    if (clienteRef.current) clienteRef.current.value = "";
    if (empleadoRef.current) empleadoRef.current.value = "";
    if (sucursalRef.current) sucursalRef.current.value = "";
  };

  const handleFieldChange = (id, field, value) => {
    setSaleProds((saleProds) =>
      saleProds.map((s) => (s.idProduct === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4"style={{marginTop:"70px"}}>Registrar Nueva Venta</h2 >
      {message && <div className="alert alert-info">{message}</div>}
      {/* Formulario visible para crear o editar venta */}

      <form onSubmit={creatSale} className="card p-4 shadow-sm">
        <div className="row" style={{ marginBottom: "2%" }}>
          <div className="col-md-4">
            <label className="form-label">Cliente</label>
            <select ref={clienteRef} className="form-select" required>
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Empleado</label>
            <select ref={empleadoRef} className="form-select" required>
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>{empleado.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Sucursal</label>
            <select ref={sucursalRef} className="form-select" required>
              <option value="">Seleccione una sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.address}</option>
              ))}
            </select>
          </div>
        </div>
      <div className="mb-3">
        <BuscadorProd
          saleProds={saleProds}
          setSaleProds={setSaleProds}
          productos={productos}
          setProductos={setProductos}
        ></BuscadorProd>
      </div>
      <div className="table-responsive mt-4">
        <table
          className="table table-bordered"
          id="ventaTable"
          style={{ marginTop: "2%" }}
          onSubmit={creatSale}
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Descripcion</th>
              <th style={{ width: "10%" }}>Cantidad</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {saleProds.map((prod) => (
              <tr
                key={prod.idProduct}
                onClick={() => setSelectedProductId(prod.idProduct)}
                style={{
                  backgroundColor:
                    selectedProductId === prod.idProduct ? "#a8a3a3" : "white",
                  cursor: "pointer",
                }}
              >
                <td>{prod.idProduct}</td>
                <td>{prod.description}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={prod.quantity}
                    onChange={(e) =>
                      handleFieldChange(
                        prod.idProduct,
                        "quantity",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>${prod.price.toFixed(2)}</td>
                <td>${(prod.price * prod.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Guardar Venta</button>
      </form>
    </div>
  );
};

export default CrearVentas;
