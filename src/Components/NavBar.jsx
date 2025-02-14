import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import cart from "../utils/icons/cart.svg";
import { useAuth } from "./AuthContext";
import {getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "../App.css";
import "../NavBar.css";
import { useEffect, useState } from "react";


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
      await fetch(process.env.REACT_APP_API_URL + "/logout", {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/products?description=${search}`);
    }
  };


  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo y Barra de Búsqueda */}
        <div className="d-flex align-items-center">
          <Link to="/home">
            <img
              src={rioColor}
              alt="Logo"
              style={{ width: "80px", height: "auto", marginRight: "10px" }}
              className="rounded-pill"
            />
          </Link>
          {/* Barra de búsqueda más pequeña */}
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e);
              }}
              style={{ width: "170px" }}
            />
            <button className="btn btn-outline-light" type="submit">
              Buscar
            </button>
          </form>
        </div>

        {/* Botón de menú para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de navegación */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="collapsibleNavbar"
          style={{ marginRight: "250px" }}
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={role === 1 || role === 2 ? "/productos" : "/products"}
                style={{ justifySelf: "initial" }}
              >
                Productos
              </Link>
            </li>
            {role === 1 && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Sucursales">
                    Sucursales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Empleados">
                    Empleados
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">
                    Usuarios
                  </Link>
                </li>
              </>
            )}
            {(role === 2 || role === 1) && isAuthenticated && (
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
                      <Link className="dropdown-item" to="/crear_ventas">
                        Crear Venta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/ventas">
                        Consultar Ventas
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Carrito + Botón de Sesión */}
        <div className="d-flex align-items-center navbar-nav">
          {isAuthenticated && (
            <li className="nav-item me-2">
              <Link className="nav-link" to="/userSales">
                Compras
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-item dropdown me-2">
              <button
                className="nav-link dropdown-toggle d-flex align-items-center"
                id="cartDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={cart}
                  alt="cart"
                  style={{ width: "30px", height: "30px" }}
                />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="cartDropdown"
                >
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
          {!isAuthenticated && (
            <li className="nav-item" style={{ marginRight: "10px" }}>
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/register")}
              >
                Registrate
              </button>
            </li>
          )}
          {/* Botón de Inicio/Cierre de Sesión */}
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleSession}>
              {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
            </button>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
