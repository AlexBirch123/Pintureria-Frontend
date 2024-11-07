import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import Sucursales from './Components/Sucursales';
import Clientes from './Components/Clientes';
import Empleados from './Components/Empleados';
import Proveedores from './Components/Proveedores';
import Ventas from './Components/Ventas';
import Productos from './Components/Productos';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(''); // Guarda el rol del usuario autenticado

  return (
    <Router>
      {/* Mostrar NavBar solo si el usuario está autenticado */}
      {isAuthenticated && (
        <NavBar setIsAuthenticated={setIsAuthenticated} role={role} />
      )}

      <Routes>
        {/* Rutas protegidas, solo accesibles si el usuario está autenticado */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
        <Route path="/sucursales" element={isAuthenticated && role === 'Administrador' ? <Sucursales /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />} />
        <Route path="/empleados" element={isAuthenticated && role === 'Administrador' ? <Empleados /> : <Navigate to="/login" />} />
        <Route path="/proveedores" element={isAuthenticated ? <Proveedores /> : <Navigate to="/login" />} />
        <Route path="/ventas" element={isAuthenticated ? <Ventas /> : <Navigate to="/login" />} />
        <Route path="/productos" element={isAuthenticated ? <Productos /> : <Navigate to="/login" />} />

        {/* Ruta para el Login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />

        {/* Redirigir al login por defecto */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;




