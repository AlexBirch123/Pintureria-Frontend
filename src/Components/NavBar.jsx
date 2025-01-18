import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import { URL } from "../utils/config";
import { useAuth } from "./AuthContext";
import "../App.css";

const NavBar = () => {
  const { role, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSession = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await fetch(URL + "/Users/logout", {
        method: "POST",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setIsAuthenticated(false);
          navigate("/dashboard");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div className="container-fluid d-flex justify-content-center">
        <li className="nav-item">
          <a href="/">
            <img
              src={rioColor}
              alt="Logo"
              style={{ width: "30%", height: "auto" }}
              className="rounded-pill"
            />
          </a>
        </li>

        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="collapsibleNavbar"
        >
          <ul className="navbar-nav">
            {role === 1 && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Sucursales">
                    Sucursales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Empleados">
                    Empleados
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">
                    Proveedores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Ventas">
                    Ventas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Productos">
                    Productos
                  </Link>
                </li>
              </>
            )}
            {role === 2 && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Ventas">
                    Ventas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Productos">
                    Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">
                    Proveedores
                  </Link>
                </li>
              </>
            )}
            {role === 3 && (
              <li className="nav-item">
                <Link className="nav-link" to="/Productos">
                  Productos
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated === false && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registrate
                </Link>
              </li>
            )}
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleSession}>
                {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
