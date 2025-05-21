import { body } from 'express-validator';

const validationsRegister = [
    body("username")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail().isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
    body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail().isEmail()
    .withMessage("El email no es válido"),
    body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail().isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .bail().matches(/^(?=.*[A-Z])/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula"),
    (req, res, next) => {
        console.log("Datos recibidos:", req.body);
        next();
    }
];

export default validationsRegister;
