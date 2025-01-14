import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { URL } from '../config.js';

// Crear el AuthContext
const AuthContext = createContext();

// Hook para usar el AuthContext en los componentes
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto que maneja la autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('Cliente'); 
  //const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch( URL + "/authorized", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setRole(data.level); 
        } else {
          setIsAuthenticated(false);
          setRole(null);
          // navigate("/login"); 
        }
      } catch (error) {
        setIsAuthenticated(false);
        setRole(null);
        //navigate("/login");
      }
    };

    checkAuth();
  }, [
    //navigate

  ]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
