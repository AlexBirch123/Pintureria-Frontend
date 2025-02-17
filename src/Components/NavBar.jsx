import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import cart from "../utils/icons/cart.svg";
import { useAuth } from "./AuthContext";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import "../App.css";
import "../NavBar.css";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const NavBar = ({ cartChange }) => {
  const { role, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartProds, setCartProds] = useState([]);
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          setLocalStorage([], "cart");
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

  return isMobile ? (
    // NavBar para móviles
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
      <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ marginRight: "3%" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto text-start">

           <li className="nav-item">
               <Link
                className="nav-link"
                to={(role === 1 || role === 2) && isAuthenticated ? "/productos" : "/products"}
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
                  <button className="nav-link dropdown-toggle" id="ventasDropdown" data-bs-toggle="dropdown">
                    Ventas
                  </button>
                  <ul className="dropdown-menu">
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
            {isAuthenticated && (
            <li className="nav-item me-2">
              <Link className="nav-link" to="/userSales">
                Compras
              </Link>
            </li>
            )}
            <li className="nav-item">
           <button className="nav-link" onClick={handleSession}>
              {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
             </button>
           </li>
        </ul>
        </div>
        <Link to="/home">
          <img src={rioColor} alt="Logo" style={{ width: "80px", height: "auto" }} className="rounded-pill" hidden={isMenuOpen} />
        </Link>
        <img src={cart} alt="Cart" style={{ width: "30px", height: "30px" }} onClick={() => navigate("/cartShop")} hidden={isMenuOpen}/>
      </div>
    </nav>
  ) : (
    // NavBar para PC
    <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
      <div className="container-fluid">
        <Link to="/home">
          <img src={rioColor} alt="Logo" style={{ width: "80px", height: "auto", marginRight: "10px" }} className="rounded-pill" />
        </Link>
        <form className="d-flex" onSubmit={handleSearch}>
          <input type="text" className="form-control me-2" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-outline-light" type="submit">Buscar</button>
        </form>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to={(role === 1 || role === 2) && isAuthenticated ? "/productos" : "/products"}>Productos</Link>
          </li>
          {role === 1 && isAuthenticated && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/Sucursales">Sucursales</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/Empleados">Empleados</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
            </>
          )}
          {(role === 1 || role === 2) && isAuthenticated && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/Sucursales">Clientes</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/Empleados">Proveedores</Link></li>
              <li className="nav-item dropdown">
               <button className="nav-link dropdown-toggle" id="ventasDropdown" data-bs-toggle="dropdown">
                 Ventas
               </button>
               <ul className="dropdown-menu">
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
          {isAuthenticated && (
            <li className="nav-item me-2">
              <Link className="nav-link" to="/userSales">Compras</Link>
            </li>
          )}
        </ul>
        <div className="d-flex align-items-center">
          {isAuthenticated && (
            <img src={cart} alt="Cart" style={{ width: "30px", height: "30px" }} onClick={() => navigate("/cartShop")} />
          )}
          <button className="btn btn-outline-light ms-2" style={{fontSize:"10px"}} onClick={handleSession}>{isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
