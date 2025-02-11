import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import cart from "../utils/icons/cart.svg";
import dotenv from "dotenv"
import { useAuth } from "./AuthContext";
import {getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "../App.css";
import "../NavBar.css";
import { useEffect, useState } from "react";

dotenv.config()

const NavBar = ({cartChange}) => {
  const { role, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartProds, setCartProds] = useState([])
  const [search, setSearch] = useState("")
  
  useEffect(() => {
    const updateCart = () => {
      const local = getLocalStorage("cart");
      if (local) setCartProds(local.datos);
    };

    updateCart();
  }, [cartChange]);

  const handleSession = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await fetch(process.env.URL + "/logout", {
        method: "POST",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setIsAuthenticated(false);
          navigate("/home");
          setLocalStorage([], "cart")
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
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>{" "}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="collapsibleNavbar"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/Productos">
                Productos
              </Link>
            </li>
            {role === 1 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">
                    Usuarios
                  </Link>
                </li>
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
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    id="ventasDropdown"
                  >
                    Ventas
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="ventasDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item nav-item"
                        to="/crear_ventas"
                      >
                        Crear Venta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item nav-item" to="/ventas">
                        Consultar Ventas
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
            {role === 2 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Proveedores">
                    Proveedores
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    id="ventasDropdown"
                  >
                    Ventas
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="ventasDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item nav-item"
                        to="/crear_ventas"
                      >
                        Crear Venta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item nav-item" to="/ventas">
                        Consultar Ventas
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex justify-content-center">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (search) navigate(`/products?description=${search}`);
                }
              }}
            />
          </div>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ===false && (<li>
              <button className="nav-link btn" onClick={handleSession}>
                Iniciar sesion
              </button>
            </li>)}
            {isAuthenticated === false && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registrate
                </Link>
              </li>
            )}
            {isAuthenticated === true && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  id="cartDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={cart}
                    alt="cart"
                    style={{ width: "60%", height: "60%" }}
                  />
                </button>
                <ul className="dropdown-menu" aria-labelledby="cartDropdown">
                  {cartProds ? (
                    cartProds.map((p) => {
                      return (
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/productPage?idProd=${p.idProduct}`}
                          >
                            {p.description}
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li className="dropdown-item">Carrito vacio</li>
                  )}
                  <li>
                    <Link className="dropdown-item" to="/cartShop">
                      Ver Carrito
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  id="ventasDropdown"
                >
                  Cuenta
                </button>
                <ul className="dropdown-menu" aria-labelledby="ventasDropdown">
                  <li>
                    <Link className="dropdown-item nav-item" to="/userSales">
                      Mis compras
                    </Link>
                  </li>
                  <li>
                    <button className="nav-link btn" onClick={handleSession}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
