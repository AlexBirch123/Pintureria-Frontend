import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsuarios] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [sortedOrder, setSortedOrder] = useState(null);
  const [formData, setFormData] = useState({
      userName: "",
      pswHash: "",
      email: "",
      role: "",
    });
  const {id} = useAuth()

  // Obtener users al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await fetch(process.env.REACT_APP_API_URL + "/users",{credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (!data) return
            const list = data.filter((u) => u.id !== id) //saca de la lista al usuario admin que esta en uso
            setUsers(list);
            setFilteredUsuarios(list);
          });
      } catch (error) {
        console.log("error en la peticion")
      }
    };
    if(id){
      fetchUsers();
    } 
  }, [id]);

  const searchUser = (userName, email) => {
    const existingMail = users.find((s) => s.userName === userName);
    const existingName = users.find((s) => s.email === email);
    if(existingMail) return existingMail
    if(existingName) return existingName
    return false
  };

  // Crear usuario
  const createUser = async (event) => {
    event.preventDefault();
    const {userName, pswHash,email,role} = formData
    if (userName && pswHash && email && role) {
      const existingUser = searchUser(userName, email);
      if (!existingUser) {
        const newUser = {
          userName:userName,
          email: email,
          pswHash:pswHash,
          role:role,
        };

        try {
          const res = await fetch(process.env.REACT_APP_API_URL + "/users", {
            method: "POST",
            credentials:"include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
          if (res.ok) {
            const completeUsers = await res.json();
            setUsers([...users, completeUsers]); // Actualiza la lista de users con el nuevo
            setFilteredUsuarios([...users, completeUsers]);
            resetForm();
            setMessage("Sucursal creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("Error en la solicitud");
        }
      } else setMessage("El Usuario ya existe");
    } else {
      setMessage("Todos los campos deben estar completos");
      setTimeout(() => setMessage(null), 3000);
    }
    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      userName: "",
      pswHash: "",
      email: "",
      role: "",
    })
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para eliminar sucursal
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sucursal?"
    );
    if (confirmDelete) {
      try {
        await fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
          credentials: "include",
          method: "DELETE",
        });
        const updatedSucursales = users.filter(
          (usuario) => usuario.id !== id
        );
        setUsers(updatedSucursales);
        setFilteredUsuarios(updatedSucursales);
      } catch (error) {
        setMessage("Error al eliminar el usuario");
      }
    }
  };

  const handleDoubleClick = (id, field, value) => {
    setEditingField({ id, field });
    setPrevValue(value);
  };

  const handleFieldChange = (id, field, value) => {
    const newUsuarios = users.map((usuario) => usuario.id === id ? { ...usuario, [field]: value } : usuario)
    setUsers(newUsuarios);
    setFilteredUsuarios(newUsuarios);
  };

  const handleBlur = async (id, field, value) => {
    const data = { [field]: value };
    if (field === "userName" || field === "email" ) {
      const existingUser = searchUser(value);
      if (existingUser && existingUser.id !== id) {
        alert("El nombre de usuario ya existe.");
        handleFieldChange(id, field, prevValue);
        return setPrevValue(null);
      }
    }
    try
     {
      await fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setEditingField({ id: null, field: null });
    } catch (error) {
      setMessage("Error en la solicitud");
    }
  };

  const input = (suc, field, value) => {
    return (
      <td
        onDoubleClick={() => handleDoubleClick(suc.id, field, value)}
        title="Doble click para editar"
      >
        {editingField.id === suc.id && editingField.field === field ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(suc.id, field, e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleBlur(suc.id, field, value);
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
    setFilteredUsuarios(
      users.filter(
        (c) =>
          c.userName.toLowerCase().includes(search.toLowerCase().trim()) ||
          c.email.toLowerCase().includes(search.toLowerCase().trim()) 
      )
    );
  }

  const sortList = (field) => {
      if(sortedOrder){
        const sorted = [...filteredUsers].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
          });
          setFilteredUsuarios(sorted);
      }else{
        const sorted = [...filteredUsers].sort((a, b) => {
          if (a[field] > b[field]) return -1;
          if (a[field] < b[field]) return 1;
          return 0;
        });
        setFilteredUsuarios(sorted);
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
          placeholder="Buscar usuario..."
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
          {formVisible ? "Cancelar" : "Crear Usuario"}
        </button>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
        
      {/* Formulario visible para crear */}
      {formVisible && (
        <form
          id="userForm"
          onSubmit={createUser}
          style={{ marginBottom: "3%" }}
        >
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              Nombre de usuario:
            </label>
            <input
              type="text"
              value={formData.userName} 
              onChange={handleInputChange}
              name="userName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              value={formData.pswHash} 
              onChange={handleInputChange}
              name="pswHash"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electronico:
            </label>
            <input
              type="email"
              value={formData.email} 
              onChange={handleInputChange}
              name="email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role:
            </label>
            <select
              id="role"
              value={formData.role} 
              onChange={handleInputChange}
              name="role"
              className="form-control"
              required
            >
              <option value="">Elija un role</option>
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Crear usuario
          </button>
        </form>
      )}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Sucursales */}
      <div className="table-responsive" style={{ marginTop: "3%" }}>
        <h2>Listado de Usuarios</h2>
        <table className="table table-bordered" id="sucursalTable">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("id");}}
                style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("userName");}}
                style={{ cursor: "pointer" }}>Nombre de usuario</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("email");}}
                style={{ cursor: "pointer" }}>Correo electronico</th>
              <th onClick={() => {
                  setSortedOrder(!sortedOrder);
                  sortList("role");}}
                style={{ cursor: "pointer" }}>Role</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{input(usuario, "userName", usuario.userName)}</td>
                  <td>{input(usuario, "email", usuario.email)}</td>
                  <td>
                    <select
                      id="role"
                      value={usuario.role}
                      name="role"
                      className="form-control"
                      onChange={handleBlur}
                      required
                    >
                      <option value="1">Administrador</option>
                      <option value="2">Vendedor</option>
                      <option value="3">Cliente</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(usuario.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay users registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
