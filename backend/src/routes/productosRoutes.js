import express from "express";
import db from "../config/db.js"; 

const router = express.Router();

// POST: Crear un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;
  console.log("Datos recibidos:", req.body);

  // Validar que los campos no estén vacíos
  if (!nombre || !descripcion) {
    return res.status(400).json({ error: "Nombre y descripción son obligatorios." });
  }

  try {
    // Verificar si ya existe un producto con el mismo nombre o descripción
    const [existente] = await db.execute(
      "SELECT * FROM productos WHERE nombre = ? AND descripcion = ?",
      [nombre, descripcion]
    );

    if (existente.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con el mismo nombre y descripción." });
    }

    // Insertar solo si no hay duplicados
    const [result] = await db.execute(
      "INSERT INTO productos (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );

    res.status(201).json({ message: "Producto creado", id: result.insertId });
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).json({ message: "Error al insertar producto" });
  }
});


// Ruta para buscar productos por nombre o descripción
router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    let query = "SELECT * FROM productos";
    let params = [];

    if (search) {
      if (!isNaN(search)) {
        // Si es número, buscar solo por ID
        query += " WHERE id = ?";
        params.push(Number(search));
      } else {
        // Si es texto, buscar solo por descripción
        query += " WHERE descripcion LIKE ?";
        params.push(`%${search}%`);
      }
    }

    const [productos] = await db.execute(query, params);
    res.json(productos);
  } catch (error) {
    console.error("Error al consultar productos.", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

export default router;

