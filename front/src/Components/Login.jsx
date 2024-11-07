import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setIsAuthenticated, setRole }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validacion = async () => {
    if (username && password) {
      const data = {
        userName: username,
        pswHash: password,
      };
      try {
        const res = await fetch("http://localhost:8080/allUsers/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const usuario = await res.json();
        // console.log(usuario);
        // setUser(usuario);
        // console.log(user);
        if (usuario) {
          console.log(usuario.level);
          setIsAuthenticated(true);
          switch (usuario.level) {
            case 1:
              setRole("Administrador");
              break;
            case 2:
              setRole("Vendedor");
              break;
            case 3:
              setRole("Cliente");
              break;
          }
          navigate("/dashboard");
        } else {
          setMessage("Nombre de usuario o contraseña incorrectos.");
        }
      } catch (error) {
        console.log(error);
        setMessage("Nombre de usuario o contraseña incorrectos.");
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

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleLogin}>
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
            required
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
            required
          />
        </div>
        <div className="mb-3"></div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </form>
      {message && <p className="text-danger text-center">{message}</p>}
    </div>
  );
};

export default Login;
