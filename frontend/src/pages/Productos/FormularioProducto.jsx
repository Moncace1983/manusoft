import { useState } from "react";
import axios from "axios";
import styles from "./crearproducto.module.css";
import SidebarMenu from "../../components/SidebarMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FormularioProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const { logOut } = useAuth(); // Obtiene el token del contexto de autenticación
  const { username } = useAuth(); // Obtiene el nombre de usuario del contexto de autenticación
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut(); // Llama a la función logOut del contexto
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.nombre.trim()) {
      setError("El nombre del producto es obligatorio.");
      setMensaje(null);
      return;
    }

    if (!producto.descripcion.trim()) {
      setError("La descripción del producto es obligatoria.");
      setMensaje(null);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/productos`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
      });

      setMensaje("✅ Producto creado correctamente.");
      setError(null);
      setProducto({ nombre: "", descripcion: "" });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error); // muestra el error del backend
      } else {
        setError("❌ Error al guardar el producto. Intenta nuevamente.");
      }
      setMensaje(null);
      console.error(err);
    }
  };

  return (
    <>
      <SidebarMenu username={username} onLogout={handleLogOut} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Crear Producto</h2>

        <input
          className={styles.input}
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <input
          className={styles.input1}
          type="text"
          name="descripcion"
          placeholder="Tipo de producto"
          onChange={handleChange}
        />

        <button className={styles.buttonEntrada} type="submit">
          Crear Producto
        </button>
      </form>
      {mensaje && <p className={styles.mensajeExito}>{mensaje}</p>}
      {error && <p className={styles.mensajeError}>{error}</p>}
    </>
  );
};

export default FormularioProducto;
