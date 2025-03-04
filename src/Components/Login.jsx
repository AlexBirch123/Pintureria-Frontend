import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
          setMessage("Credenciales incorrectas");
          setLoading(false)
          return
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
    setLoading(false)
  };

  const handleLogin = (e) => {
    setLoading(true)
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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100 p-4" style={{ maxWidth: "450px" }}> 
        <form onSubmit={handleLogin} className="card p-4 shadow">
          <h2 className="text-center mb-4">Inicio de sesión</h2>
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
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
          <div className="text-center mt-3">
            <Link className="link" to="/recover">
              ¿Olvidó su contraseña?
            </Link>
            <p className="mt-2">¿No tienes una cuenta?</p>
            <button onClick={handleRegisterClick} className="btn btn-secondary w-100">
              Registrarse
            </button>
          </div>
          {message && <p className="text-danger text-center mt-2">{message}</p>}
        </form>
        {loading &&(
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border" role="status"></div>
          <div className="ms-2">Cargando...</div>
        </div>
        )}
      </div>
    </div>
  );
};


export default Login;
