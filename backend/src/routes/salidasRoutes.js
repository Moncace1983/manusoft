import express from 'express';
import registrarSalida from '../controllers/salidasController.js';

const router = express.Router();

router.post('/', registrarSalida);

export default router;

