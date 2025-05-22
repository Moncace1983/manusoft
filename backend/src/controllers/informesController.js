import db from "../config/db.js";

// Obtener inventario actual
export const obtenerInventario = async (req, res) => {
  try {
    const [productos] = await db.query("SELECT * FROM productos");
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};

// Obtener entradas
export const obtenerEntradas = async (req, res) => {
  try {
    const [entradas] = await db.query(`
      SELECT e.id, e.fecha, ed.producto_id, p.nombre, ed.cantidad 
      FROM entradas e
      JOIN entradas_detalle ed ON e.id = ed.entrada_id
      JOIN productos p ON ed.producto_id = p.id
    `);
    res.json(entradas);
  } catch (error) {
    console.error("Error al obtener entradas:", error);
    res.status(500).json({ error: "Error al obtener entradas" });
  }
};

// Obtener salidas
export const obtenerSalidas = async (req, res) => {
  try {
    const [salidas] = await db.query(`
      SELECT s.id, s.fecha, sd.producto_id, p.nombre, sd.cantidad 
      FROM salidas s
      JOIN salidas_detalle sd ON s.id = sd.salida_id
      JOIN productos p ON sd.producto_id = p.id
    `);
    res.json(salidas);
  } catch (error) {
    console.error("Error al obtener salidas:", error);
    res.status(500).json({ error: "Error al obtener salidas" });
  }
};
