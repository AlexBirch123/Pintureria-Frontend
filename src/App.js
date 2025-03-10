import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
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
import CrearVentas from './Components/CrearVentas.jsx';
import ViewProducts from './Components/ViewProducts.jsx';
import ProductPage from './Components/ProductPage.jsx';
import Cart from './Components/Cart.jsx';
import Usuarios from './Components/Usuarios.jsx';
import { useState } from 'react';
import Footer from './Components/Footer.jsx';
import UserSales from './Components/UserSales.jsx';
import NotFound from './Components/NotFound.jsx';
import NotAuth from './Components/NotAuth.jsx';
import XLSXReader from './Components/XLSX.jsx';
import Contacto from './Components/Contacto.jsx';
import { Loading } from './Components/Loading.jsx';

function App() {

  const { isAuthenticated, role } = useAuth();
  const [cartChange,setCartChange] = useState(true)

  return (
    <HashRouter>
      {/* Mostrar NavBar solo si el usuario está autenticado */}
      <NavBar cartChange={cartChange}/>

      <Routes>
        {/* Rutas protegidas, solo accesibles si el usuario está autenticado */}
        <Route path="/sucursales" element={isAuthenticated && role === 1 ? (<Sucursales />) : (<NotAuth/>)}/>
        <Route path="/clientes" element={isAuthenticated && (role === 1 || role === 2) ? (<Clientes />) : (<NotAuth/>)}/>
        <Route path="/empleados"element={isAuthenticated && role === 1 ? (<Empleados />) : (<NotAuth/>)}/>
        <Route path="/proveedores"element={isAuthenticated && (role === 1 || role === 2) ? (<Proveedores />) : (<NotAuth/>)}/>
        <Route path="/ventas"element={isAuthenticated && (role === 1 || role === 2) ? (<VerVentas />) : (<NotAuth/>)}/>
        <Route path="/crear_ventas" element={isAuthenticated && (role === 1 || role === 2) ? (<CrearVentas />) : (<NotAuth/>)} />
        <Route path="/usuarios" element={isAuthenticated && role === 1  ? (<Usuarios />) : (<NotAuth/>)} />
        <Route path="/userSales" element={isAuthenticated ===  null ? <Loading/> : isAuthenticated ? (<UserSales />) : (<NotAuth/>)} />
        <Route path="/productos" element={isAuthenticated && (role === 1 || role === 2) ? (<Productos />) : (<NotAuth/>)} />
        <Route path="/import" element={isAuthenticated && (role === 1 || role === 2) ? (<XLSXReader/>) : (<NotAuth/>)}/>
        <Route path="/contacto" element={<Contacto/>}/>

        {/* Rutas para el carrito */}
        <Route path="/payment" element={isAuthenticated ? <Cart setCartChange={setCartChange} cartChange={cartChange}/>:<Navigate to="/login" />} />
        <Route path="/cartShop" element={isAuthenticated ===  null ? <Loading/> : isAuthenticated ? <Cart setCartChange={setCartChange} cartChange={cartChange}/>:<Navigate to="/login" />} />

        {/* Rutas para el usuarios */}
        <Route path="/productPage" element={<ProductPage  setCartChange={setCartChange} cartChange={cartChange}/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ViewProducts  />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />}/>
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <RegistroCliente />} />
        <Route path="/recover" element={<Recover />}/>

        {/* Redirigir al login por defecto */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Redirigir a 404 si no existe la ruta */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Footer/>
    </HashRouter>
  );
}

export default App;




