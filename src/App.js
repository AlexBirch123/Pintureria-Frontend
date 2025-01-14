import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import Sucursales from './Components/Sucursales';
import Clientes from './Components/Clientes';
import Empleados from './Components/Empleados';
import Proveedores from './Components/Proveedores';
import Ventas from './Components/Ventas';
import Productos from './Components/Productos';
import Home from './home.js';

import './App.css';
import RegistroCliente from './Components/RegistroCliente';
import { useAuth } from './Components/AuthContext.jsx';

function App() {

  const { isAuthenticated, role } = useAuth();

  return (
     <Router>
       {/* Mostrar NavBar solo si el usuario está autenticado */}
       {isAuthenticated && ( <NavBar/>)}

       <Routes>
         {/* Rutas protegidas, solo accesibles si el usuario está autenticado */}
         <Route path="/sucursales" element={isAuthenticated && role === 'Administrador' ? <Sucursales /> : <Navigate to="/notAuth" />} />
         <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/notAuth" />} />
         <Route path="/empleados" element={isAuthenticated && role === 'Administrador' ? <Empleados /> : <Navigate to="/notAuth" />} />
         <Route path="/proveedores" element={isAuthenticated ? <Proveedores /> : <Navigate to="/notAuth" />} />
         <Route path="/ventas" element={isAuthenticated ? <Ventas /> : <Navigate to="/notAuth" />} />
         <Route path="/productos" element={isAuthenticated ? <Productos role={role} /> : <Navigate to="/notAuth" />} />
         <Route path="/home" element={<Home role={role}/>} />

         {/* Ruta para el Login */}
         <Route path="/login" element={ <Login/> } />
         <Route path="/register" element={<RegistroCliente />} />

         {/* Redirigir al login por defecto */}
         {/* <Route path="/" element={<Navigate to="/home" />} /> */}
         <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" />: <Navigate to="/login" />} />
       </Routes>
    </Router>

  );
}

export default App;




