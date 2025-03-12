import { createContext, useContext, useState, useEffect } from "react";

// Crear el AuthContext
const AuthContext = createContext();

// Hook para usar el AuthContext en los componentes
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto que maneja la autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/authorized", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setRole(data.role);
          setId(data.id)
          setUserName(data.userName)
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setRole(null);
      }
    };

    checkAuth();
  });

  const login = async (userName, pswHash) => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, pswHash }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setRole(data.role);
        setId(data.id);
        setUserName(data.userName);
        return { success: true };
      } else {
        return { success: false, message: "Credenciales incorrectas" };
      }
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if(!res.ok) return{ success: false, message: "Credenciales incorrectas" };
      setIsAuthenticated(false);
      setRole(null);
      setId(null);
      setUserName(null);
      return {success: true}
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role ,id, userName , login, logout}}
    >
      {children}
    </AuthContext.Provider>
  );
};
