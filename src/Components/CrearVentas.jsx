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

    const fetchProd = () => fetchData("/Products", "products", setProductos);
    const fetchEmp = () => fetchData("/Employees", "employees", setEmpleados);
    const fetchClient = () => fetchData("/Clients", "clients", setClientes);
    const fetchSuc = () => fetchData("/Branches", "branches", setSucursales);

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
      if (!(total > 0))return setMessage("El total de la venta debe ser mayor a 0");
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + `/Sales`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });
        if(res.ok){
          setMessage("Venta creada con éxito");}
          setTimeout(setMessage(null), 3000);
      } catch (error) {
        setMessage("Error al crear la venta");
        setTimeout(setMessage(null), 3000);
      }
      setSaleProds([]);
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

  const showTotal = (prod) => {
    const total = prod.price * prod.quantity;
    return total;
  }

  return (
    <div style={{ marginTop: "5%", marginLeft: "1%", marginRight: "1%" }}>
      <h2 className="mb-4"style={{marginTop:"20px"}}>Registrar Nueva Venta</h2 >
      {message && <div className="alert alert-info">{message}</div>}
      {/* Formulario visible para crear o editar venta */}

      <form onSubmit={creatSale} className="card p-4 shadow-sm">
      <button type="submit" className="btn btn-success mt-3">Guardar Venta</button>
        <div className="row" style={{ marginTop: "1%" }}>
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
      </form>
      <div className="card p-4 shadow-sm" style={{ marginTop: "2%" }}>
      <div className="mb-3" >
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
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th style={{ width: "10%" }}>Cantidad</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {saleProds.length !== 0 ? (
              saleProds.map((prod) => (
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
                <td>{prod.title}</td>
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
                <td>${prod.price}</td>
                <td>{showTotal(prod)}</td>
              </tr>
              ))):(
              <tr>
                <td colSpan={5} className="text-center">No hay productos seleccionados</td>
              </tr>
                )}
          </tbody>
        </table>
      </div>
      </div>
      
    </div>
  );
};

export default CrearVentas;
