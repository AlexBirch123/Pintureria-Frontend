import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import { URL } from "../utils/config";
import BuscadorProd from "./BuscardorProd";

const CrearVentas = () => {

  const [saleProds, setSaleProds] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const clienteRef = useRef(null);
  const empleadoRef = useRef(null);
  const sucursalRef = useRef(null);

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

  const creatRows = async (id) => {
    try {
      const datos = saleProds.map((prod) => {
        prod.idSale = id;
        return prod;
      });
      await fetch(URL + `/Rows`, {
        method: "POST",
        credentials: "include",
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

  const updateStock = async () => {
    try {
      const datos = saleProds.map((prod) => {
        const total = prod.stock - prod.amount;
        return { id: prod.idProduct, amount: total };
      });
      datos.forEach(async (d) => {
        await fetch(URL + `/Products/${d.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: d.amount }),
        });
      });
    } catch (error) {
      console.log("error al actualiza stock");
    }
  };

  // Crear venta
  const creatSale = async (e) => {
    e.preventDefault();
    const idClient = clienteRef.current.value;
    const idEmp = empleadoRef.current.value;
    const idBranch = sucursalRef.current.value;

    if (idClient && idEmp && idBranch) {
      let total = 0;
      saleProds.map((prod) => (total += prod.price * prod.amount));
      const newSale = {
        idClient: idClient,
        idBranch: idBranch,
        idEmp: idEmp,
        total: total,
      };
      try {
        const res = await fetch(URL + `/Sales`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });
        if (res.ok) {
          const idSale = await res.json();
          await creatRows(idSale);
          await updateStock();
        }
      } catch (error) {
        console.log(" error al crear la venta", error);
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

  return (
    <div style={{ marginTop: "5%" }}>
      {/* Formulario visible para crear o editar venta */}
      <form id="ventaForm" style={{ marginTop: "5%" }}>
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
          <BuscadorProd
            saleProds={saleProds}
            setSaleProds={setSaleProds}
            productos={productos}
            setProductos={setProductos}
          ></BuscadorProd>

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
                <tr key={prod.idProduct}>
                  <td>{prod.idProduct}</td>
                  <td>{prod.description}</td>
                  <td>
                    <input
                      type="number"
                      value={prod.amount}
                      onChange={(e) =>
                        handleFieldChange(
                          prod.idProduct,
                          "amount",
                          e.target.value
                        )
                      }
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>$ {prod.price.toFixed(2)}</td>
                  <td>{prod.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Venta
        </button>
      </form>
    </div>
  );
};

export default CrearVentas;
