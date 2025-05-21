import { body } from 'express-validator';

const validationsLogin = [
    //Validaciones de usuario

body('username')
    .notEmpty().withMessage("El nombre del usuario es requrido")
    //.bail().isEmail().withMessage("El email no es valido"),
    .bail().isLength({min: 3}).withMessage("El nombre de usuario debe tener al menos 3 caracteres"),

    //Validaciones de contraseña
body('password')
    .notEmpty().withMessage("La contraseña es requerida")
]

export default validationsLogin;