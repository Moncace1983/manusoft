import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./consultaInventario.module.css";
import SidebarMenu from "../../components/SidebarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ConsultaInventario = () => {
  const [productos, setProductos] = useState([]);
  const [busquedad, setBusquedad] = useState("");
  const { logOut } = useAuth(); // Obtiene el token del contexto de autenticación
  const { username } = useAuth(); // Obtiene el nombre de usuario del contexto de autenticación
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut(); // Llama a la función logOut del contexto
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  const fetchProductos = async (searchTerm = "") => {
    try {
      const res = await axios.get("http://localhost:3002/api/productos", {
        params: { search: searchTerm },
      });
      setProductos(res.data);
      if (res.data.length === 0) {
        alert("No se encontraron productos.");
      }
    } catch (error) {
      console.error("Error al consultar productos.", error);
    }
  };

  useEffect(() => {
    fetchProductos(); // al cargar la pagina
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchProductos(busquedad);
  };

  return (
    <>
      <SidebarMenu username={username} onLogout={handleLogOut} />
      <div className={styles.container}>
        <h2 className={styles.tittleConsulta}>Consulta de Inventario</h2>
        <form onSubmit={handleBuscar} className={styles.form}>
          <input
            className={styles.inputConsulta}
            type="text"
            placeholder="Buscar producto"
            value={busquedad}
            onChange={(e) => setBusquedad(e.target.value)}
          />
          <button className={styles.buttonConsulta} type="submit">
            Buscar
          </button>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.iconConsulta}
            onClick={handleBuscar}
          />
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ConsultaInventario;
