import { useState } from "react";
import styles from "./styles/SidebarMenu.module.css";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import menuIcon from "../assets/menu.jpg";
import { useAuth } from "../context/AuthContext";

const SidebarMenu = ({ onLogout }) => {
  const { username } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductosOpen, setIsProductosOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsProductosOpen(false); // Cierra el submenú al cerrar el sidebar.
    }
  };

  const toggleProductos = () => {
    setIsProductosOpen(!isProductosOpen);
  };

  const handleSubmenuClick = () => {
    setIsOpen(false); // Cerrar el sidebar.
    setIsProductosOpen(false); // Cerrar el submenú.
  };

  return (
    <>
      {/* Botón para abrir el menú */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.menuIconContainer} onClick={toggleSidebar}>
          <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
          <span className={styles.titleMenu}>Menú</span>
        </div>

        {/* Menú lateral */}

        <h3>Hola, {username?.nombre ? username.nombre : "usuario"}</h3>

        <ul>
          <li>
            <Link to="/home" onClick={toggleSidebar}>
              Inicio
            </Link>
          </li>

          <li onClick={toggleProductos} className={styles.submenuTrigger}>
            Productos ▸
          </li>
          {isProductosOpen && (
            <ul className={styles.submenu}>
              <li>
                <Link to="/crear_producto" onClick={handleSubmenuClick}>
                  Crear producto
                </Link>
              </li>
              <li>
                <Link to="/entrada_productos" onClick={handleSubmenuClick}>
                  Entrada productos
                </Link>
              </li>
              <li>
                <Link to="/consulta_inventario" onClick={handleSubmenuClick}>
                  Consulta de inventario
                </Link>
              </li>
              <li>
                <Link to="/salida_producto" onClick={handleSubmenuClick}>
                  Salida de productos
                </Link>
              </li>
            </ul>
          )}

          <li>
            <Link to="/informes" onClick={toggleSidebar}>
              Informes
            </Link>
          </li>
          <button onClick={onLogout} className={styles.button}>
            Cerrar Sesión
          </button>
        </ul>
      </div>

      {/* Fondo oscuro al abrir el menú */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default SidebarMenu;
