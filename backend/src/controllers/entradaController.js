import db from "../config/db.js";

export const registrarEntrada = async (req, res) => {
  const { producto_id, descripcion, cantidad } = req.body;

  if (!cantidad || isNaN(cantidad)) {
    return res.status(400).json({ message: "La cantidad es inválida." });
  }

  try {
    // Buscar producto por ID o por descripción
    let producto;

    if (producto_id) {
      const [rows] = await db.execute(
        "SELECT * FROM productos WHERE id = ?",
        [producto_id]
      );
      if (rows.length > 0) producto = rows[0];
    }

    if (!producto && descripcion) {
      const [rows] = await db.execute(
        "SELECT * FROM productos WHERE descripcion = ?",
        [descripcion]
      );
      if (rows.length > 0) producto = rows[0];
    }

    if (!producto) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado o no existe." });
    }

    const cantidadActual = producto.cantidad ?? 0;
    const nuevaCantidad = cantidadActual + parseInt(cantidad);

    // Actualizar la cantidad del producto
    await db.execute(
      "UPDATE productos SET cantidad = ? WHERE id = ?",
      [nuevaCantidad, producto.id]
    );

    // Insertar en tabla de entradas
    const [entradaResult] = await db.execute(
      "INSERT INTO entradas (producto_id, cantidad, fecha) VALUES (?, ?, NOW())",
      [producto.id, cantidad]
    );

    const entradaId = entradaResult.insertId;

    // Insertar en tabla entradas_detalle
    await db.execute(
      "INSERT INTO entradas_detalle (entrada_id, producto_id, cantidad) VALUES (?, ?, ?)",
      [entradaId, producto.id, cantidad]
    );

    res.status(200).json({ message: "Entrada registrada correctamente." });

  } catch (error) {
    console.error("Error al registrar entrada:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor al registrar la entrada." });
  }
};

