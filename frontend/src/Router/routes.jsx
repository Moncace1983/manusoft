import { Navigate, Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Productos from "../pages/Productos";
import ConsultaInventario from "../pages/Productos/ConsultaInventario";
import PrivateRoutes from "./PrivateRoutes";
import { useAuth } from "../context/AuthContext";
import SalidaProducto from "../pages/Productos/SalidaProducto";
import EntradaProductos from "../pages/Productos/EntradaProductos";
import Informes from "../pages/Informes/Informes";

const Router = () => {
  const { token } = useAuth(); // Obtiene el token del contexto de autenticación

  return (
    <Routes>
      <Route
        path="/register"
        element={token ? <Navigate to="/home" /> : <Register />}
      />
      <Route path="/" element={token ? <Navigate to="/home" /> : <Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/crear_producto" element={<Productos />} />
        <Route path="/entrada_productos" element={<EntradaProductos />} />
        <Route path="/consulta_inventario" element={<ConsultaInventario />} />
        <Route path="/salida_producto" element={<SalidaProducto />} />
        <Route path="/informes" element={<Informes />} />
      </Route>
    </Routes>
  );
};

export default Router;
