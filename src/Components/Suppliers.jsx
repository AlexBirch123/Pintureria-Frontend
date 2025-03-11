import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { motion } from "framer-motion";

const Proveedores = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", cuit: "" });
  
  useEffect(() => {
    const fetchSupp = async () => {
      const local = getLocalStorage("branches");
      
        try {
          await fetch(process.env.REACT_APP_API_URL + "/suppliers",{credentials: "include"})
            .then((res) => res.json())
            .then((data) => {
              if (!data) return setSuppliers(local.datos);
              setSuppliers(data);
              setFilteredProveedores(data);
              setLocalStorage(data, "suppliers");
            });
        } catch (error) {
          setSuppliers(local.datos);
        }
      };

    fetchSupp();
  }, []);

  const searchSupp = (cuit) => {
    const supp = suppliers.find((p) => p.cuit === cuit);
    return supp;
  };

  // Crear proveedor
  const createUpdateSupp = async (event) => {
    event.preventDefault();
    const { name, address, phone, cuit } = formData;
    
    if (name && cuit) {
      const existingSupp = searchSupp(cuit); //verifica que el CUIT no exista
      if (!existingSupp) {
        const newSupp = { name, address, phone: Number(phone), cuit: Number(cuit) };

        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/suppliers", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSupp),
          });
          if (res.ok) {
            const completeSupp = await res.json();
            setSuppliers([...suppliers, completeSupp]);
            setLocalStorage([...suppliers, completeSupp], "suppliers");
            setFilteredProveedores([...suppliers, completeSupp]);
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("Error al crear el proveedor");
        }
      } else setMessage("CUIT/CUIL ya registrado");
    } else setMessage("error al crear o proveedor");
    setTimeout(() => {
      setMessage(null);
    }, 3000);
    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({ name: "", address: "", phone: "", cuit: "" })
  };

  // Función para eliminar proveedor
  const deleteProveedor = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );
    if (confirmDelete) {
      await fetch(process.env.REACT_APP_API_URL + `/suppliers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updatedSupp = suppliers.filter((p) => p.id !== id);
      setSuppliers(updatedSupp);
      setFilteredProveedores(updatedSupp);
    }
  };

    const handleDoubleClick = (id, field, value) => {
      setEditingField({ id, field });
      setPrevValue(value);
    };
  
    const handleFieldChange = (id, field, value) => {
      const newList = suppliers.map((prov) =>
        prov.id === id ? { ...prov, [field]: value } : prov
      )
      setSuppliers(newList);
      setFilteredProveedores(newList);
    };
  
    const handleBlur = async (id, field, value) => {
      const data = { [field]: value };
      if (field === "address") {
        const addressExists = searchSupp(value);
        if (addressExists && addressExists.id !== id) {
          alert("La direccion ya existe.");
          handleFieldChange(id, field, prevValue);
          return setPrevValue(null);
        }
      }
      try {
        await fetch(process.env.REACT_APP_API_URL + `/suppliers/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        setLocalStorage(suppliers, "suppliers");
        setEditingField({ id: null, field: null });
      } catch (error) {
        setMessage("Error en la solicitud");
      }
    };

    const input = (arr, field, value) => {
      return (
        <td
          onDoubleClick={() => handleDoubleClick(arr.id, field, value)}
          title="Doble click para editar"
        >
          {editingField.id === arr.id && editingField.field === field ? (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(arr.id, field, e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleBlur(arr.id, field, value);
                }
              }}
              autoFocus
            />
          ) : (
            value
          )}
        </td>
      );
    };

    const handleSearch = (e) => {
      e.preventDefault();
      setFilteredProveedores(
        suppliers.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
            c.cuit.toString().includes(search.trim()) ||
            c.address.toLowerCase().includes(search.toLowerCase().trim()) ||
            c.phone.toString().includes(search.trim())
        )
      );
    }
  
    const sortList = (field) => {
        if(sortedOrder){
          const sorted = [...filteredProveedores].sort((a, b) => {
              if (a[field] < b[field]) return -1;
              if (a[field] > b[field]) return 1;
              return 0;
            });
            setFilteredProveedores(sorted);
        }else{
          const sorted = [...filteredProveedores].sort((a, b) => {
            if (a[field] > b[field]) return -1;
            if (a[field] < b[field]) return 1;
            return 0;
          });
          setFilteredProveedores(sorted);
        };
    }

  return (
    <div style={{ marginTop: "5%", marginLeft: "1%", marginRight: "1%" }}>
      <div
        className="d-flex justify-content-between mb-3"
        style={{ marginTop: "20px" }}
      >
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="form-control w-25"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e);
            }
          }}
        />
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear proveedor"}
        </button>
      </div>

      {message && (
      <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: -50, opacity: 0 }}
           className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-lg z-50"
         >
           Producto creado exitosamente 🎉
         </motion.div>
        )} 
      {/* Formulario visible para crear o editar proveedor */}
      {formVisible && (
        <form onSubmit={createUpdateSupp} className="card p-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">CUIT/CUIL:</label>
          <input type="text" value={formData.cuit} onChange={(e) => setFormData({ ...formData, cuit: e.target.value })} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección:</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-control" />
        </div>
        <button type="submit" className="btn btn-success">Guardar</button>
      </form>
      )}

        

      {/* Tabla de Proveedores */}
      <div className="table-responsive">
        <h2 className="mt-4">Listado de Proveedores</h2>
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("name");}}
                style={{ cursor: "pointer" }}>Nombre</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("cuit");}}
                style={{ cursor: "pointer" }}>CUIT/CUIL</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("phone");}}
                style={{ cursor: "pointer" }}>Teléfono</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("address");}}
                style={{ cursor: "pointer" }}>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.id}</td>
                  {input(prov,"name", prov.name)}
                  {input(prov,"cuit", prov.cuit)}
                  {input(prov,"phone", prov.phone)}
                  {input(prov,"address", prov.address)}
                  <td>
                    <button
                      onClick={() => deleteProveedor(prov.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay suppliers registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
