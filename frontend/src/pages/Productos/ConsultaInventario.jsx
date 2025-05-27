import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./consultaInventario.module.css";
import SidebarMenu from "../../components/SidebarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ConsultaInventario = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [sinResultados, setSinResultados] = useState(false);
  const { logOut, username } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/");
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProductos = async (searchTerm = "") => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`, {
        params: { search: searchTerm },
      });
      setProductos(res.data);
      setSinResultados(res.data.length === 0);
    } catch (error) {
      console.error("Error al consultar productos.", error);
    }
  };

  useEffect(() => {
    fetchProductos(); // Carga inicial
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchProductos(busqueda);
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
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button className={styles.buttonConsulta} type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>

        {sinResultados && (
          <p className={styles.mensajeVacio}>No se encontraron productos.</p>
        )}

        {productos.length > 0 && (
          <>
            <p className={styles.resumen}>
              Total de productos encontrados: {productos.length}
            </p>
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
          </>
        )}
      </div>
    </>
  );
};

export default ConsultaInventario;

