import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import rioColor from "../rio_color.png";
import cart from "../utils/icons/cart.svg";
// import location from "../utils/icons/location.svg"
import location from "../utils/icons/location2.svg"
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
  const [categorias, setCategorias] = useState([]);
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

  useEffect(() => {
    const fetchData = async (url, localStorageKey, setState) => {
          const local = getLocalStorage(localStorageKey);
          try {
          const res = await fetch(process.env.REACT_APP_API_URL + url, { credentials: "include" });
          if (!res.ok) return setState(local.datos);
          const data = await res.json();
          setState(data);
          setLocalStorage(data, localStorageKey);
          } catch (error) {
          console.log(error);
          setState(local.datos);
          }
        };
        fetchData("/category", "category", setCategorias);
  }, []);

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
    <nav className="navbar navbar-dark bg-dark fixed-top"  style={{marginBottom: "5%"}}>
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

          <li className="nav-item" style={{ marginTop: "1%" }}>
          <form className="d-flex" onSubmit={(e)=>{
            setIsMenuOpen(false)
            handleSearch(e)
          }}>
          <input type="text" className="form-control me-2" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          </li>
          <li>
            <Link to="/sucursales" className="nav-item">
              <img src={location} className="nav-link" alt="Sucursales" style={{ width: "20px", marginRight: "5px" }} /> Sucursales
            </Link>
          </li>
           <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
               <Link className="nav-link" to={(role === 1 || role === 2) && isAuthenticated ? "/productos" : "/products"}>
                Productos
              </Link>
            </li>
            <li className="nav-item dropdown">
               <button className="nav-link dropdown-toggle" id="ventasDropdown" data-bs-toggle="dropdown">
                 Categorias
               </button>
                {categorias.length > 0 &&(
                  <ul className="dropdown-menu">
                     {categorias.map((cat)=>{
                      return(
                     <li key={cat.id}><Link className="dropdown-item" onClick={()=>{navigate(`/products?category=${cat.id}`)}}>
                        {cat.description}
                      </Link></li>)})}
               </ul>)}      
             </li>
            {role === 1 && isAuthenticated && (
              <>
                <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                  <Link className="nav-link" to="/Sucursales">
                    Sucursales
                  </Link>
                </li>
                <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                  <Link className="nav-link" to="/Empleados">
                    Empleados
                  </Link>
                </li>
                <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                  <Link className="nav-link" to="/usuarios">
                    Usuarios
                  </Link>
                </li>
              </>
            )}
            {(role === 2 || role === 1) && isAuthenticated && (
              <>
                <li className="nav-item"  onClick={() => setIsMenuOpen(false)}>
                  <Link className="nav-link" to="/Clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item"  onClick={() => setIsMenuOpen(false)}>
                  <Link className="nav-link" to="/Proveedores">
                    Proveedores
                  </Link>
                </li>
                <li className="nav-item dropdown" onClick={() => setIsMenuOpen(false)}>
                  <button className="nav-link dropdown-toggle" id="ventasDropdown" data-bs-toggle="dropdown">
                    Ventas
                  </button>
                  <ul className="dropdown-menu">
                    <li onClick={() => setIsMenuOpen(false)}>
                      <Link className="dropdown-item" to="/crear_ventas">
                        Crear Venta
                      </Link>
                    </li>
                    <li onClick={() => setIsMenuOpen(false)}>
                      <Link className="dropdown-item" to="/ventas">
                        Consultar Ventas
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
            {isAuthenticated && (
            <li className="nav-item me-2" onClick={() => setIsMenuOpen(false)}>
              <Link className="nav-link" to="/userSales">
                Compras
              </Link>
            </li>
            )}
            <li className="nav-item">
           <button className="nav-link" 
           onClick={() => {
            setIsMenuOpen(false)
            handleSession()}}>
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
          <Link to="/contacto" className="nav-link">
            <img src={location} alt="Sucursales" style={{ width: "20px", marginRight: "5px" }} /> Sucursales
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={(role === 1 || role === 2) && isAuthenticated ? "/productos" : "/products"}>Productos</Link>
        </li>
        <li className="nav-item dropdown">
           <button className="nav-link dropdown-toggle" id="catDropdown" data-bs-toggle="dropdown">
           Categorias
           </button>
          {categorias.length > 0 &&(
            <ul className="dropdown-menu">
             {categorias.map((cat) => {
                      return(
                         <li key={cat.id}>
                           <Link className="dropdown-item" to={`/products?category=${cat.id}`}>
                             {cat.description}
                           </Link>
                         </li>)})}
                  </ul>)}
        </li>
        

        {(role === 1 || role === 2) && isAuthenticated &&(
          <li className="nav-item dropdown">
               <button className="nav-link dropdown-toggle" id="menuDropdown" data-bs-toggle="dropdown">
                 {role === 1 ? "Administrador": "Vendedor"}
               </button>
        <ul className="dropdown-menu">
          {role === 1 && isAuthenticated && (
            <>
              <li className="nav-item"><Link className="dropdown-item" to="/sucursales">Sucursales</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/empleados">Empleados</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/usuarios">Usuarios</Link></li>
            </>
          )}
              <li className="nav-item"><Link className="dropdown-item" to="/clientes">Clientes</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/proveedores">Proveedores</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/ventas">Ventas</Link></li>
          </ul>
        </li>)}      


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
