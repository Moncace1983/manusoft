import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./entradaproductos.module.css";
import SidebarMenu from "../../components/SidebarMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EntradaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [listaEntrada, setListaEntrada] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const { logOut } = useAuth(); // Obtiene el token del contexto de autenticación
  const { username } = useAuth(); // Obtiene el nombre de usuario del contexto de autenticación
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut(); // Llama a la función logOut del contexto
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/productos");
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };
    fetchProductos();
  }, []);

  const productoFiltrado = productos.find(
    (prod) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(prod.id) === busqueda.trim()
  );

  const agregarProducto = () => {
    if (!productoFiltrado) {
      setError(" ✖️ Producto no encontrado");
      return;
    }

    if (listaEntrada.length >= 10) {
      setError("Solo se pueden ingresar hasta 10 productos por lote.");
      return;
    }

    if (!cantidad || parseInt(cantidad) <= 0) {
      setError("Cantidad inválida");
      return;
    }

    const yaExiste = listaEntrada.find((p) => p.id === productoFiltrado.id);
    if (yaExiste) {
      setError("Este producto ya fue agregado.");
      return;
    }

    setListaEntrada([
      ...listaEntrada,
      { ...productoFiltrado, cantidad: parseInt(cantidad) },
    ]);
    setBusqueda("");
    setCantidad("");
    setError(null);
    setMensaje(null);
  };

  const eliminarProducto = (id) => {
    const actualizada = listaEntrada.filter((p) => p.id !== id);
    setListaEntrada(actualizada);
  };

  const editarCantidad = (id, nuevaCantidad) => {
    const actualizada = listaEntrada.map((p) =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    );
    setListaEntrada(actualizada);
  };

  const guardarIngreso = async () => {
    for (const prod of listaEntrada) {
      try {
        const payload = {
          producto_id: prod.id,
          nombre: prod.nombre,
          cantidad: prod.cantidad,
          fecha: new Date().toISOString().split("T")[0],
        };

        console.log("Enviando:", payload);
        await axios.post("http://localhost:3002/api/entradas", payload);
      } catch (err) {
        console.error(`Error al ingresar producto ${prod.nombre}:`, err);
        setError(`Error al ingresar ${prod.nombre}. Revisa el servidor.`);
        return;
      }
    }

    setMensaje("¡ Ingreso guardado exitosamente !");
    setListaEntrada([]);
    setError(null);
  };

  return (
    <>
      <SidebarMenu username={username} onLogout={handleLogOut} />
      <h2 className={styles.entradaTittle}>Entrada de Productos</h2>
      <div className={styles.entradaContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar por ID, nombre o descripción"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button onClick={agregarProducto}>Agregar a la lista</button>

        <ul className={styles.listaProductos}>
          {listaEntrada.map((prod) => (
            <li key={prod.id}>
              <strong>{prod.nombre}</strong> - Cantidad:
              <input
                className={styles.input}
                type="number"
                value={prod.cantidad}
                onChange={(e) =>
                  editarCantidad(prod.id, parseInt(e.target.value) || 1)
                }
              />
              <button onClick={() => eliminarProducto(prod.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {listaEntrada.length > 0 && (
          <button onClick={guardarIngreso} className={styles.buttonEntrada}>
            Guardar Ingreso
          </button>
        )}
      </div>
      {mensaje && <p className={styles.mensajeExito}>{mensaje}</p>}
      {error && <p className={styles.mensajeError}>{error}</p>}
    </>
  );
};

export default EntradaProductos;
