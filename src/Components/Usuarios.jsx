import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { URL } from "../utils/config";

const Usuarios = () => {
  const emailRef = useRef(null);
  const userNameRef = useRef(null);
  const roleRef = useRef(null);
  const pswRef = useRef(null);
  const [users, setusers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [message, setMessage] = useState(null);
  const [prevValue, setPrevValue] = useState(null);

  // Obtener sucursales al cargar el componente
  useEffect(() => {
    const fetchBranches = async () => {

      try {
        await fetch(URL + "/users",{credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (!data) return 
            setusers(data);
          });
      } catch (error) {
        console.log("Error en la peticion")
      }
    };
    fetchBranches();
  }, []);

  const searchUser = (email,userName) => {
    const user = users.find((s) => (s.userName === userName)&&(s.email=== email));
    return user;
  };


  // Crear sucursal
  const createSucursal = async (event) => {
    event.preventDefault();
    const userName = userNameRef.current?.value;
    const role = Number(roleRef.current?.value);
    const email = emailRef.current?.value;
    const psw = pswRef.current?.value;
    const existingUser = searchUser(email,userName);
      if (!existingUser) {
        const newUser= {
          userName:userName,
          role:role,
          email:email,
          pswHash:psw,
        }
        try {
          const res = await fetch(URL + "/users", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
          if (res.ok) {
            const completeUser = await res.json();
            setusers([...users, completeUser]); // Actualiza la lista de productos con el nuevo
            resetForm();
            setMessage("Usuario creada correctamente");
            setTimeout(() => setMessage(null), 3000);
          }
        } catch (error) {
          setMessage("Error en la solicitud");
        }
      } else setMessage("El Usuario ya existe");
    setFormVisible(false);
  };

  // Mostrar/ocultar formulario
  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  // Limpiar formulario
  const resetForm = () => {
    if (userNameRef.current) userNameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (pswRef.current) pswRef.current.value = "";
    if (roleRef.current) roleRef.current.value = "";
  };

  // Función para eliminar sucursal
  const deleteSucursal = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );
    if (confirmDelete) {
      try {
        await fetch(URL + `/users/${id}`, {
          method: "DELETE",
        });
        const updatedSucursales = users.filter(
          (sucursal) => sucursal.id !== id
        );
        setusers(updatedSucursales);
      } catch (error) {
        setMessage("Error al eliminar la sucursal");
      }
    }
  };

  // const handleDoubleClick = (id, field, value) => {
  //   setEditingField({ id, field });
  //   setPrevValue(value);
  // };

  // const handleFieldChange = (id, field, value) => {
  //   setSucursales((prevSucursales) =>
  //     prevSucursales.map((sucursal) =>
  //       sucursal.id === id ? { ...sucursal, [field]: value } : sucursal
  //     )
  //   );
  // };

  // const handleBlur = async (id, field, value) => {
  //   const data = { [field]: value };
  //   if (field === "address") {
  //     const addressExists = searchBranch(value);
  //     if (addressExists && addressExists.id !== id) {
  //       alert("La direccion ya existe.");
  //       setSucursales((prevSucursales) =>
  //         prevSucursales.map((sucursal) =>
  //           sucursal.id === id ? { ...sucursal, [field]: prevValue } : sucursal
  //         )
  //       );
  //       return setPrevValue(null);
  //     }
  //   }
  //   try {
  //     await fetch(URL + `/Branches/${id}`, {
  //       method: "PATCH",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     setEditingField({ id: null, field: null });
  //   } catch (error) {
  //     setMessage("Error en la solicitud");
  //   }
  // };

  // const input = (suc, field, value) => {
  //   return (
  //     <td
  //       onDoubleClick={() => handleDoubleClick(suc.id, field, value)}
  //       title="Doble click para editar"
  //     >
  //       {editingField.id === suc.id && editingField.field === field ? (
  //         <input
  //           type="text"
  //           value={value}
  //           onChange={(e) => handleFieldChange(suc.id, field, e.target.value)}
  //           onKeyDown={async (e) => {
  //             if (e.key === "Enter") {
  //               await handleBlur(suc.id, field, value);
  //             }
  //           }}
  //           autoFocus
  //         />
  //       ) : (
  //         value
  //       )}
  //     </td>
  //   );
  // };

  return (
    <div style={{ marginTop: "5%" }}>
      <div className="btn-group">
        <button
          id="b_create"
          onClick={toggleFormVisibility}
          type="button"
          className="btn btn-primary"
        >
          {formVisible ? "Cancelar" : "Crear usuario"}
        </button>
      </div>

      {/* Formulario visible para crear o editar sucursal */}
      {formVisible && (
        <form
          id="sucursalForm"
          onSubmit={createSucursal}
          style={{ marginBottom: "3%" }}
        >
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Nombre de ususario:
            </label>
            <input
              type="text"
              ref={userNameRef}
              name="direccion"
              className="form-control"
              placeholder="Nombre de Usuario"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Email:
            </label>
            <input
              type="text"
              ref={emailRef}
              name="email"
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Role:
            </label>
            <select
              ref={roleRef}
              name="role"
              className="form-control"
              required
            >
                <option value="">Seleccione una opcion</option>
                <option value="1">Administrador</option>
                <option value="2">Vendedor</option>
                <option value="3">Cliente</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              ref={pswRef}
              name="password"
              className="form-control"
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar usuario
          </button>
        </form>
      )}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabla de Sucursales */}
      <div className="table-responsive" style={{ marginTop: "3%" }}>
        <h2>Listado de usuarios</h2>
        <table className="table table-bordered" id="sucursalTable">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => deleteSucursal(user.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No hay usuarios registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
