import express from 'express';
import { obtenerEntradas, obtenerInventario, obtenerSalidas, } from '../controllers/informesController.js';

const router = express.Router();

router.get('/inventario', obtenerInventario);
router.get('/entradas', obtenerEntradas);
router.get('/salidas', obtenerSalidas);

export default router;