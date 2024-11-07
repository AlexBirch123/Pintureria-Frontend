import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        await fetch("http://localhost:8080/allBranches")
          .then((res) => res.json())
          .then((data) => {
            setSucursales(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchBranches();
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
          const res = await fetch(
            `http://localhost:8080/allBranches/${editingSucursal.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editingSucursal),
            }
          );
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
            const res = await fetch("http://localhost:8080/allBranches", {
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
      await fetch(`http://localhost:8080/allBranches/${id}`, {
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
