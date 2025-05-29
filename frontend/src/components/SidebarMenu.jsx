import { useState } from "react";
import styles from "./styles/SidebarMenu.module.css";
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
      setIsProductosOpen(false);
    }
  };

  const toggleProductos = () => {
    setIsProductosOpen(!isProductosOpen);
  };

  const handleSubmenuClick = () => {
    setIsOpen(false);
    setIsProductosOpen(false);
  };

  return (
    <>
      {/* Ícono fijo del menú, se mueve si el sidebar está abierto */}
      <div
        className={`${styles.menuIconContainer} ${isOpen ? styles.menuIconOpen : ""}`}
        onClick={toggleSidebar}
      >
        <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
        <span className={styles.titleMenu}>Menú</span>
      </div>

      {/* Sidebar lateral */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <h3>Hola, {username?.nombre || "usuario"}</h3>

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

      {/* Fondo oscuro para cerrar el menú */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default SidebarMenu;

