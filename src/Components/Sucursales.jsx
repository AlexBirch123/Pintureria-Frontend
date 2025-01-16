import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../config";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);

  const getLocalStorage = (clave) => {
    const item = localStorage.getItem(clave);
    if (!item) return null;
    const { datos, timestamp } = JSON.parse(item);
    return { datos, timestamp };
  };

  const fetchBranches = async (local, now) => {
    try {
      await fetch(URL + "/Branches")
        .then((res) => res.json())
        .then((data) => {
          setSucursales(data);
          localStorage.setItem(
            "branches",
            JSON.stringify({ datos: data, timestamp: now })
          );
        });
    } catch (error) {
      console.log(error);
      setSucursales(local.datos);
    }
  };

  useEffect(() => {
    const getBranches = async () => {
      const local = getLocalStorage("branches");
      const now = Date.now();
      if (!local) return fetchBranches(local, now);
      if (now - local.timestamp > 180000) return fetchBranches(local, now);
      setSucursales(local.datos);
    };

    getBranches();
  }, []);

  const searchBranch = (addres) => {
    const branch = sucursales.find((s) => (s.addres = addres));
    return branch;
  };

  // Crear o actualizar sucursal
  const createUpdateSucursal = async (event) => {
    event.preventDefault();
    const addres = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    console.log(editingSucursal);
    if (phone && addres) {
      //Actualizar
      if (editingSucursal) {
        editingSucursal.addres = addres;
        editingSucursal.phone = phone;
        console.log(editingSucursal);
        try {
          const res = await fetch(URL + `/Branches/${editingSucursal.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editingSucursal),
          });
          if (res.ok) {
            const updatedBranches = sucursales.map((sucursal) =>
              sucursal.id === editingSucursal.id ? editingSucursal : sucursal
            );
            setSucursales(updatedBranches);
            resetForm();
            setEditingSucursal(null);
          }
        } catch (error) {
          console.log(error);
        }
        setEditingSucursal(null);
      } else {
        // Crear nueva sucursal
        const existingBranch = searchBranch(addres);
        if (!existingBranch) {
          const newBranch = {
            addres: addres,
            phone: phone,
          };
          try {
            const res = await fetch(URL + "/Branches", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newBranch),
            });
            if (res.ok) {
              const completeBranch = await res.json();
              setSucursales([...sucursales, completeBranch]); // Actualiza la lista de productos con el nuevo
              resetForm();
            }
          } catch (error) {
            console.error("Error en la solicitud:", error);
          }
        } else console.log("Direccion ya existente");
      }
    } else console.log("Todos los campos deben estar completos");
    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    setEditingSucursal(null); // Resetear sucursal en edición
  };

  // Limpiar formulario
  const resetForm = () => {
    if (direccionRef.current) direccionRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
  };

  // Función para eliminar sucursal
  const deleteSucursal = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sucursal?"
    );
    if (confirmDelete) {
      await fetch(URL + `/Branches/${id}`, {
        method: "DELETE",
      });
      const updatedSucursales = sucursales.filter(
        (sucursal) => sucursal.id !== id
      );
      setSucursales(updatedSucursales);
    }
  };

  return (
    <div style={{ marginTop: "5%" }}>
      <div className="btn-group">
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear Sucursal"}
        </button>
      </div>

      {/* Formulario visible para crear o editar sucursal */}
      {formVisible && (
        <form
          id="sucursalForm"
          onSubmit={createUpdateSucursal}
          style={{ marginBottom: "3%" }}
        >
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección:
            </label>
            <input
              type="text"
              ref={direccionRef}
              name="direccion"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono:
            </label>
            <input
              type="text"
              ref={telefonoRef}
              name="telefono"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingSucursal ? "Actualizar Sucursal" : "Guardar Sucursal"}
          </button>
        </form>
      )}

      {/* Tabla de Sucursales */}
      <div className="table-responsive" style={{ marginTop: "3%" }}>
        <h2>Listado de Sucursales</h2>
        <table className="table table-bordered" id="sucursalTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.length > 0 ? (
              sucursales.map((sucursal) => (
                <tr key={sucursal.id}>
                  <td>{sucursal.id}</td>
                  <td>{sucursal.addres}</td>
                  <td>{sucursal.phone}</td>
                  <td>
                    <button
                      onClick={() => {
                        setFormVisible(true);
                        setEditingSucursal(sucursal);
                      }}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => deleteSucursal(sucursal.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No hay sucursales registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sucursales;
