import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import { URL } from "../config";
import { useAuth } from "./AuthContext";

const NavBar = () => {

  const { isAuthenticated, role , setIsAuthenticated } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async() => {
    try {
      await fetch( URL +"/Users/logout", {
        method: "POST",
        credentials: "include",
      }).then(res =>{
          if(res.ok){
            setIsAuthenticated(false); // Actualiza el estado de autenticación
            navigate ("/login"); // Redirige al usuario al login
          }
      })  
    } catch (error) {
      console.log(error)
    }
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
