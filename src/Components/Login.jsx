import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setIsAuthenticated, setRole } = useAuth();
  const navigate = useNavigate();

  const validacion = async () => {
    if (username && password) {
      const data = {
        userName: username,
        pswHash: password,
      };
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          return setMessage("Credenciales incorrectas");
        }
        const role = await res.json();

        setMessage("Datos correctos");
        setIsAuthenticated(true);
        setRole(role);
        navigate("/home");
      } catch (error) {
        setMessage("Nombre de usuario o contraseña incorrectos");
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setMessage("Por favor, ingrese todos los campos.");
      return;
    }
    validacion();
  };
  const handleRegisterClick = () => {
    navigate("/register"); // Redirigir a la página de registro de clientes
  };

  return (
    <div className="container" style={{ maxWidth: "20%", marginTop: "50px" }}> 
      <form onSubmit={handleLogin}>
      <h2 className="text-center">Inicio de sesión</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombre de Usuario:
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      <div className="text-center mt-3">
        <Link className="link" to="/recover">
          ¿Olvidó su contraseña?
        </Link>
        <p>¿No tienes una cuenta?</p>
        <button onClick={handleRegisterClick} className="btn btn-secondary">
          Registrarse
        </button>
      </div>
      {message && <p className="text-danger text-center">{message}</p>}
      </form>
      {/* Botón de Registro */}

    </div>
  );
};

export default Login;
