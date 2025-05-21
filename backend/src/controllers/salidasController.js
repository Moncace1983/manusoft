import db from '../config/db.js';

const registrarSalida = async (req, res) => {
  const { salidas } = req.body;

  try {
    // Validar stock antes de hacer cualquier cambio
    for (const item of salidas) {
      const [productoRows] = await db.query(
        "SELECT cantidad, nombre FROM productos WHERE id = ?",
        [item.productoId]
      );

      if (productoRows.length === 0) {
        return res.status(400).json({
          error: `Producto con ID ${item.productoId} no encontrado.`,
        });
      }

      const producto = productoRows[0];
      const stockActual = producto.cantidad;
      const cantidadSolicitada = parseInt(item.cantidad, 10);

      if (cantidadSolicitada > stockActual) {
        return res.status(400).json({
          error: `Stock insuficiente para "${producto.nombre}". Disponible: ${stockActual}, solicitado: ${cantidadSolicitada}.`,
        });
      }
    }

    // Insertar encabezado de la salida
    const [salidaResult] = await db.query(
      "INSERT INTO salidas (fecha) VALUES (NOW())"
    );
    const salidaId = salidaResult.insertId;

    // Registrar detalle y descontar inventario
    for (const item of salidas) {
      await db.query(
        "INSERT INTO salidas_detalle (salida_id, producto_id, cantidad) VALUES (?, ?, ?)",
        [salidaId, item.productoId, item.cantidad]
      );

      await db.query(
        "UPDATE productos SET cantidad = cantidad - ? WHERE id = ?",
        [item.cantidad, item.productoId]
      );
    }

    res.json({
      mensaje: "Salida registrada exitosamente",
      salidaId,
      productos: salidas,
    });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    res.status(500).json({ error: "Error al registrar la salida" });
  }
};

export default registrarSalida;
