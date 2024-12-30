import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";

const NavBar = ({ isAuthenticated, role, setIsAuthenticated }) => {
  const handleLogout = async() => {
    await fetch("http://localhost:8080/Users/logout", {
      method: "POST",
      credentials: "include"
    })
    setIsAuthenticated(false); // Actualiza el estado de autenticación
    window.location.href = "/login"; // Redirige al usuario al login
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div className="container-fluid">
        <img
          src={rioColor}
          alt="Logo"
          style={{ width: "10%", height: "auto" }}
          className="rounded-pill"
        />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav">
            {role === "Administrador" && (
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
            {role === "Vendedor" && (
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
            {role === "Cliente" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Productos">
                  Productos
                </Link>
              </li>
            )}
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
