import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const Recover = () => {
  const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // // const [role, setLocalRole] = useState("");
  const [message, setMessage] = useState("");
  // const {setIsAuthenticated,setRole } = useAuth()
  // const navigate = useNavigate();

  // const validacion = async () => {
  //   if (username && password) {
  //     const data = {
  //       userName: username,
  //       pswHash: password,
  //     };
  //     try {
  //       const res = await fetch( process.env.URL +"/users/login", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       });
  //       if (!res.ok) {
  //         return setMessage("Credenciales incorrectas");

  //       }
  //       const level = await res.json()

  //       setMessage("Datos correctos");
  //       setIsAuthenticated(true);
  //       setRole(level)
  //       navigate("/dashboard");

  //     } catch (error) {
  //       setMessage("Nombre de usuario o contraseña incorrectos");
  //     }
  //   }
  // };

  const handleRecover = async (e) => {
    e.preventDefault();
    try {
      await fetch(process.env.REACT_APP_API_URL + "/recover", {
        method:"POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      })

    } catch (error) {
      console.log(error)
    }
    //   if (username === "" || password === "") {
    //     setMessage("Por favor, ingrese todos los campos.");
    //     return;
    //   }
    //   validacion();
    // };
    // const handleRegisterClick = () => {
    //   navigate("/register"); // Redirigir a la página de registro de clientes
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "200px" }}>
      
      <button onClick={handleRecover}>Enviar mail</button>
      {/* <h2 className="text-center">Recuperacion de contraseña</h2>
      <form onSubmit={handleRecover}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Correo electronico:
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Confirmar
        </button>
      </form>
      {message && <p className="text-danger text-center">{message}</p>} */}

      {/* Botón de Registro */}
      {/* <div className="text-center mt-3">
        <Link className="link" to="/recoverPassword">
          ¿Olvidó su contraseña?
        </Link>
        <p>¿No tienes una cuenta?</p>
        <button onClick={handleRegisterClick} className="btn btn-secondary">
          Registrarse
        </button>
      </div> */}
    </div>
  );
};

export default Recover;
