import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { motion } from "framer-motion";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedOrder, setSortedOrder] = useState(false);
  const nombreRef = useRef(null);
  const direccionRef = useRef(null);
  const telefonoRef = useRef(null);
  const cuitRef = useRef(null);

  useEffect(() => {
    const fetchSupp = async () => {
      const local = getLocalStorage("branches");
      
        try {
          await fetch(process.env.REACT_APP_API_URL + "/suppliers",{credentials: "include"})
            .then((res) => res.json())
            .then((data) => {
              if (!data) return setProveedores(local.datos);
              setProveedores(data);
              setFilteredProveedores(data);
              setLocalStorage(data, "suppliers");
            });
        } catch (error) {
          setProveedores(local.datos);
        }
      };

    fetchSupp();
  }, []);

  const searchSupp = (cuit) => {
    const client = proveedores.find((p) => p.cuit === cuit);
    return client;
  };

  // Crear proveedor
  const createUpdateSupp = async (event) => {
    event.preventDefault();
    const name = nombreRef.current?.value;
    const address = direccionRef.current?.value;
    const phone = Number(telefonoRef.current?.value);
    const cuit = Number(cuitRef.current?.value);
    
    if (name && cuit) {
      const existingSupp = searchSupp(cuit); //verifica que el CUIT no exista
      if (!existingSupp) {
        const newSupp = {
          name: name,
          address: address,
          phone: phone,
          cuit: cuit,
        };
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
            setProveedores([...proveedores, completeSupp]);
            setLocalStorage([...proveedores, completeSupp], "suppliers");
            setFilteredProveedores([...proveedores, completeSupp]);
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          console.log(error);
        }
      } else console.log("CUIT/CUIL ya registrado");
    } else console.log("error al crear o actualizar proveedores");

    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    if (nombreRef.current) nombreRef.current.value = "";
    if (direccionRef.current) direccionRef.current.value = "";
    if (telefonoRef.current) telefonoRef.current.value = "";
    if (cuitRef.current) cuitRef.current.value = "";
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
      const updatedSupp = proveedores.filter((p) => p.id !== id);
      setProveedores(updatedSupp);
      setFilteredProveedores(updatedSupp);
    }
  };

    const handleDoubleClick = (id, field, value) => {
      setEditingField({ id, field });
      setPrevValue(value);
    };
  
    const handleFieldChange = (id, field, value) => {
      const newList = proveedores.map((prov) =>
        prov.id === id ? { ...prov, [field]: value } : prov
      )
      setProveedores(newList);
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
        setLocalStorage(proveedores, "suppliers");
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
        proveedores.filter(
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
              console.log(search);
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
          <input type="text" ref={nombreRef} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">CUIT/CUIL:</label>
          <input type="text" ref={cuitRef} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección:</label>
          <input type="text" ref={direccionRef} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input type="text" ref={telefonoRef} className="form-control" />
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
                <td colSpan={6}>No hay proveedores registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
