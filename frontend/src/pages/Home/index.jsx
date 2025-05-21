import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Home/home.module.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import SidebarMenu from "../../components/SidebarMenu";
import imagen from "../../assets/manu.png";

const Home = () => {
  const [username, setUserName] = useState("");
  const { logOut } = useAuth(); // Obtiene el token del contexto de autenticación
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.username);
    }
  }, []);

  const handleLogOut = () => {
    logOut(); // Llama a la función logOut del contexto
    navigate("/");
  };

  return (
    <>
      <SidebarMenu username={username} onLogout={handleLogOut} />

      <div className={styles.titleMenu}>
        <h1 className={styles.homeTittle}>Usuario: {username}</h1>
        <p>Bienvenido al sistema de Gestion de Inventario MANUSOFT</p>
        <img src={imagen} alt="Logo" className={styles.logo} />
      </div>
    </>
  );
};

export default Home;
