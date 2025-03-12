import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import BuscadorProd from "./BuscardorProd";


const CrearVentas = () => {
  const [saleProds, setSaleProds] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClientes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
      idClient: "",
      idEmp: "",
      idBranch: ""
    });

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
      setState(local.datos);
      }
    };

    fetchData("/products", "products", setProducts);
    fetchData("/employees", "employees", setEmployees);
    fetchData("/clients", "clients", setClientes);
    fetchData("/branches", "branches", setBranches);
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
    const {idClient ,idEmp ,idBranch} = formData 
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
        const res = await fetch(process.env.REACT_APP_API_URL + `/sales`, {
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
    setFormData({
      idClient: "",
      idEmp: "",
      idBranch: ""
    })
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
            <select 
            value={formData.idClient} 
            name="idClient" 
            onChange={handleInputChange} 
            className="form-select" 
            required
            >
              <option value="">Seleccione un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Empleado</label>
            <select 
            value={formData.idEmp} 
            name="idEmp" 
            onChange={handleInputChange} 
            className="form-select" 
            required
            >
              <option value="">Seleccione un employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Sucursal</label>
            <select 
            value={formData.idBranch} 
            name="idBranch" 
            onChange={handleInputChange} 
            className="form-select" 
            required
            >
              <option value="">Seleccione una branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.address}</option>
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
          products={products}
          setProductss={setProducts}
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
              <th>Total</th>
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
                <td colSpan={5} className="text-center">No hay products seleccionados</td>
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
