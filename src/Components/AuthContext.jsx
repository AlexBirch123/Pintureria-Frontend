import { createContext, useContext, useState, useEffect } from "react";

// Crear el AuthContext
const AuthContext = createContext();

// Hook para usar el AuthContext en los componentes
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto que maneja la autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(process.env.URL + "/authorized", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setRole(data.role);
          setId(data.id)
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setRole(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, role, setRole ,id, setId}}
    >
      {children}
    </AuthContext.Provider>
  );
};
