import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
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
import ProductPage from './Components/ProductPage.jsx';
import Cart from './Components/Cart.jsx';
import Usuarios from './Components/Usuarios.jsx';
import { useState } from 'react';
import Footer from './Components/Footer.jsx';
import UserSales from './Components/UserSales.jsx';

function App() {

  const { isAuthenticated, role } = useAuth();
  const [cartChange,setCartChange] = useState(true)


  return (
    <HashRouter>
      {/* Mostrar NavBar solo si el usuario está autenticado */}
      <NavBar cartChange={cartChange}/>

      <Routes>
        {/* Rutas protegidas, solo accesibles si el usuario está autenticado */}
        <Route path="/sucursales" element={isAuthenticated && role === 1 ? (<Sucursales />) : (<Navigate to="/home" />)}/>
        <Route path="/clientes" element={isAuthenticated && (role === 1 || role === 2) ? (<Clientes />) : (<Navigate to="/home" />)}/>
        <Route path="/empleados"element={isAuthenticated && role === 1 ? (<Empleados />) : (<Navigate to="/home" />)}/>
        <Route path="/proveedores"element={isAuthenticated && (role === 1 || role === 2) ? (<Proveedores />) : (<Navigate to="/home" />)}/>
        <Route path="/ventas"element={isAuthenticated && (role === 1 || role === 2) ? (<VerVentas />) : (<Navigate to="/home" />)}/>
        <Route path="/crear_ventas" element={isAuthenticated && (role === 1 || role === 2) ? (<CrearVentas />) : (<Navigate to="/home" />)} />
        <Route path="/cartShop" element={isAuthenticated && <Cart setCartChange={setCartChange} cartChange={cartChange}/>} />
        <Route path="/usuarios" element={isAuthenticated && role === 1  ? (<Usuarios />) : (<Navigate to="/home" />)} />
        <Route path="/userSales" element={isAuthenticated  ? (<UserSales />) : (<Navigate to="/home" />)} />
        <Route path="/payment" element={isAuthenticated && <Cart setCartChange={setCartChange} cartChange={cartChange}/>} />
        <Route path="/productos" element={isAuthenticated && (role === 1 || role === 2) ? (<Productos />) : (<Navigate to="/home" />)} />

        {/* Rutas para el usuarios */}
        <Route path="/productPage" element={<ProductPage  setCartChange={setCartChange} cartChange={cartChange}/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ViewProducts  />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />}/>
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <RegistroCliente />} />
        <Route path="/recover" element={isAuthenticated ? <Navigate to="/home" /> : <Recover />}/>

        { /*Redirigir al login por defecto */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
      <Footer/>
    </HashRouter>
  );
}

export default App;




