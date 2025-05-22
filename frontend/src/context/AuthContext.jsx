import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUserName] = useState(null);

  // Cargar datos de autenticación desde sessionStorage al iniciar la aplicación
  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    const userData = sessionStorage.getItem("userData");

    if (authToken) {
      setToken(authToken);
    }

    if (userData) {
      try {
        setUserName(JSON.parse(userData));
      } catch (error) {
        console.error("Error al parsear userData desde sessionStorage:", error);
        sessionStorage.removeItem("userData"); // Limpia datos corruptos
        setUserName(null);
      }
    }
  }, []);

  //Guardar datos de autenticación
  const setAuthData = (token, user) => {
    setToken(token);
    setUserName(user);
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("userData", JSON.stringify(user));
  };

  //Cerrar sesión
  const logOut = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, setAuthData, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
