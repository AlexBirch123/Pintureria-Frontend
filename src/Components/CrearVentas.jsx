import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";
import { URL } from "../utils/config";
import BuscadorProd from "./BuscardorProd";

const CrearVentas = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);
  const [listProd, setListProd] = useState([]);
  const [saleProds, setSaleProds] = useState([]);
  const [rowsSale, setRowsSale] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [editingField, setEditingField] = useState({ id: null, field: "" });
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

  // const sumarStock = async (id, stock, cantidad) => {
  //   try {
  //     const datos = {
  //       stock: stock + cantidad,
  //     };
  //     await fetch(`http://localhost:8080/allProducts/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(datos),
  //     });
  //   } catch (error) {
  //     console.log("error al actualiza stock");
  //   }
  // };

  // const creatRows = async (datos) => {
  //   try {
  //     const res = await fetch(`http://localhost:8080/allRows`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(datos),
  //     });
  //   } catch (error) {
  //     console.log("error al crear las filas");
  //     return;
  //   }
  // };

  // const cargaFilasVenta = async (id) => {
  //   try {
  //     const res = await fetch(`http://localhost:8080/allRows/${id}`);
  //     const data = await res.json();
  //     setRowsSale(data);
  //     console.log(data);
  //     console.log(rowsSale);
  //   } catch (error) {
  //     console.log("error al actualiza stock");
  //   }
  // };

  // const updateStock = async (id, stock, cantidad) => {
  //   try {
  //     const datos = {
  //       stock: stock - cantidad,
  //     };
  //     await fetch(`http://localhost:8080/allProducts/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(datos),
  //     });
  //   } catch (error) {
  //     console.log("error al actualiza stock");
  //   }
  // };

  let renglones = [];
  // Crear venta
  // const createVenta = async (event) => {
  //   event.preventDefault();
  //   console.log(renglones);
  //   toggleFormVisibility();
  //   const idClient = clienteRef.current.value;
  //   const idEmp = empleadoRef.current.value;
  //   const idBranch = sucursalRef.current.value;

  //   if (idClient && idEmp && idBranch) {
  //     let prodFiltrados = [];
  //     renglones.forEach((r) => {
  //       productos.forEach((prod) => {
  //         if (prod.id === r.id) {
  //           prodFiltrados.push({ ...prod, cantidad: Number(r.cantidad) });
  //         }
  //       });
  //     });
  //     let total = 0;
  //     prodFiltrados.map((pr) => (total += pr.price * pr.cantidad));
  //     const newSale = {
  //       idClient: idClient,
  //       idBranch: idBranch,
  //       idEmp: idEmp,
  //       total: total,
  //     };
  //     try {
  //       const res = await fetch(`http://localhost:8080/allSales`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newSale),
  //       });
  //       if (res.ok) {
  //         const completeSale = await res.json();
  //         try {
  //           const rows = [];
  //           prodFiltrados.forEach((p) => {
  //             const newRow = {
  //               idSale: completeSale.id,
  //               idProduct: p.id,
  //               description: p.description,
  //               price: p.price,
  //               amount: p.cantidad,
  //               total: p.cantidad * p.price,
  //             };
  //             rows.push(newRow);
  //           });
  //           rows.forEach((row) =>
  //             //carga los productos de la venta
  //             creatRows(row)
  //           );

  //           prodFiltrados.forEach((p) =>
  //             updateStock(p.id, p.stock, p.cantidad)
  //           );
  //         } catch (error) {
  //           console.log(" erro al crear la venta", error);
  //         }
  //         setVentas([...ventas, completeSale]);
  //         resetForm();
  //         // setEditingClient(null);
  //       }
  //     } catch (error) {
  //       console.log(" erro al crear la venta", error);
  //     }
  //   }
  //   fetchProd();
  // };

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

  // Función para eliminar venta
  // const handleDeleteRow = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "¿Estás seguro de eliminar esta venta?"
  //   );
  //   if (confirmDelete) {
  //     await fetch(`http://localhost:8080/allSales/${id}`, {
  //       method: "DELETE",
  //     });
  //     await fetch(`http://localhost:8080/allRows/sale/${id}`, {
  //       method: "DELETE",
  //     });
  //     const updatedVentas = ventas.filter((v) => v.id !== id);
  //     cargaFilasVenta(id);
  //     rowsSale.forEach((r) => sumarStock(r.idProduct, r.amount));

  //     setRowsSale(null);
  //   }
  // };



    
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
                    onChange={(e) => handleFieldChange(prod.idProduct, "amount", e.target.value)}
                    style={{ width: "100%" }}
                    />
                  </td>
                  <td>$  {prod.price.toFixed(2)}</td>
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
