import express from "express";
import { registrarEntrada } from "../controllers/entradaController.js";

const router = express.Router();

// Ruta POST para registrar entrada
router.post("/", registrarEntrada);

export default router;
