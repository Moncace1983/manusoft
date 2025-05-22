import SidebarMenu from "../../components/SidebarMenu.jsx";
import FormularioProducto from "./FormularioProducto.jsx";
import styles from "./crearproducto.module.css";

const Productos = () => {
  return (
    <div className={styles.container}>
      <h1>Gestión de inventario</h1>
      <SidebarMenu />
      <FormularioProducto />
    </div>
  );
};

export default Productos;
