import { createContext, useContext, useState } from 'react';

// Crear el AuthContext
const AuthContext = createContext();

// Hook para usar el AuthContext en los componentes
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto que maneja la autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(''); // Aquí almacenamos el rol

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
