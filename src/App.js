import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import Sucursales from './Components/Sucursales';
import Clientes from './Components/Clientes';
import Empleados from './Components/Empleados';
import Proveedores from './Components/Proveedores';
import Productos from './Components/Productos';
import Home from './home.js';
import './App.css';
import RegistroCliente from './Components/RegistroCliente';
import { useAuth } from './Components/AuthContext.jsx';
import Recover from './Components/Recover.jsx';
import VerVentas from './Components/VerVentas.jsx';
import BuscadorProd from './Components/BuscardorProd.jsx';
import CrearVentas from './Components/CrearVentas.jsx';
import ViewProducts from './Components/ViewProducts.jsx';
import { useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from './utils/localStorage.js';
import { useState } from 'react';
import { URL } from './utils/config.js';

function App() {

  const { isAuthenticated, role } = useAuth();
  const { productos, setProductos } = useState();

  useEffect(() => {
      const fetchProd = async () => {
        const local = getLocalStorage("products");
        try {
          await fetch(URL + "/Products", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
              if (!data) return setProductos(local.datos);
              setProductos(data);
              setLocalStorage(data, "products");
            });
        } catch (error) {
          console.log(error);
        }
      };
      fetchProd()
     },[])

  return (
    <Router>
      {/* Mostrar NavBar solo si el usuario está autenticado */}
      <NavBar />

      <Routes>
        {/* Rutas protegidas, solo accesibles si el usuario está autenticado */}
        <Route path="/sucursales" element={isAuthenticated && role === 1 ? (<Sucursales />) : (<Navigate to="/notAuth" />)}/>
        <Route path="/clientes" element={isAuthenticated && (role === 1 || role === 2) ? (<Clientes />) : (<Navigate to="/notAuth" />)}/>
        <Route path="/empleados"element={isAuthenticated && role === 1 ? (<Empleados />) : (<Navigate to="/notAuth" />)}/>
        <Route path="/proveedores"element={isAuthenticated && (role === 1 || role === 2) ? (<Proveedores />) : (<Navigate to="/notAuth" />)}/>
        <Route path="/ventas"element={isAuthenticated && (role === 1 || role === 2) ? (<VerVentas />) : (<Navigate to="/notAuth" />)}/>
        <Route path="/crear_ventas" element={<CrearVentas />} />
        <Route path="/products" element={<ViewProducts productos={productos} />} />

        <Route path="/buscador" element={<BuscadorProd />} />

        <Route path="/productos" element={<Productos role={role} />} />
        <Route path="/home" element={<Home role={role} />} />

        {/* Ruta para el Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/register" element={<RegistroCliente />} />
        <Route
          path="/recoverPassword"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Recover />}
        />

        {/* Redirigir al login por defecto */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;




