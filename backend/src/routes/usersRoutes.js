import express from 'express';
import usersController from '../controllers/usersController.js';
import validationsRegister from '../middlewares/validateRegisterMiddleware.js';
import validationsLogin from '../middlewares/validateLoginMiddleware.js';

const router = express.Router();

// Ruta para mostrar los usuarios
router.get("/", usersController.getAllUsers);

// Ruta para crear un nuevo usuario
router.post("/register", validationsRegister, usersController.createUsers);

// Ruta para hacer login
router.post("/login", validationsLogin, usersController.loginProcess);

export default router;