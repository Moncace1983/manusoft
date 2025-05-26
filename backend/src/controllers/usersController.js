import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const secretKey = "your_secret_key"; // Cambia esto por una clave secreta más segura

const usersController = {
    //Leer todos los usuarios GET
    getAllUsers: async (req, res) => {
        try { 
            const [users] = await db.query("SELECT id, username, email FROM users");
            res.json({
                meta: {status: 200},
                data: users,
            });
            
        }   catch (error) {
            res.status(500).json({message: "Error al obtener usuarios", error });
        }
        
    },

    // Crear Usuario en la base de datos
    createUsers: async (req, res) => {
        try {

            const resultValidation = validationResult(req);
            if (!resultValidation.isEmpty()) {
                return res.status(400).json({errors: resultValidation.array()});
            }

            const { username, email, password } = req.body;
            
            const [existingUser] = await db.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username]);
            if (existingUser.length > 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "El email o nombre de usuario ya está registrado",
                            path: "email",
                        }
                    ]
                });
            }

            const hashedPassword = bcryptjs.hashSync(password, 10);
            const createdAt = new Date();
            const updatedAt = new Date();

            await db.query("INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
                [username, email, hashedPassword, createdAt, updatedAt] 
            );

            res.status(201).json({
                meta: {
                    status: 201,
                },
                message: "Usuario creado con éxito",
                user: {
                    username,
                    email
                }
            });

        } catch (error) {
            // Manejo de errores
            console.error("Error al crear usuario:", error);
            res.status(500).json({message: "Error interno del servidor"});
        }
    },

    // Login de usuario
    loginProcess: async (req, res) => {
        
        try {
            //Validar datos de entrada
            const resultValidation = validationResult(req);
            if (!resultValidation.isEmpty()) {
                return res.status(400).json({errors: resultValidation.array()});
            }
            
            const {username, password} = req.body;
            console.log("Usuario buscado:", username);
           
            const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            const userToLogin = rows[0]; // Obtener el primer usuario que coincida

            if(userToLogin) {
                //Comparar la contraseña
                const isOkThePassword = bcryptjs.compareSync(password, userToLogin.password);

                if(isOkThePassword){
                    //Eliminar la contraseña del objeto usuario
                    delete userToLogin.password;
                    
                    //Enviar token de autenticación 
                    const token = jwt.sign({ id: userToLogin.id,
                        username: userToLogin.username,
                        email: userToLogin.email,
                     }, secretKey, { expiresIn: '1h' });
                    
                    return res.status(200).json({
                        token,
                        message: "Inicio de sesión exitoso",
                    });
                }
                //Contraseña incorrecta
                return res.status(400).json({
                    errors: [
                        {
                            path: "password",
                            msg: "La contraseña es incorrecta",
                        }
                    ]
                });
            }

            return res.status(400).json({
                errors: [
                     {  
                        path: "username",
                        msg: "Nombre de Usuario no registrado",
                    }
                ]
            });
            

        } catch (error) {
            console.error("Error en el proceso de inicio de sesión", error);
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }
};

export default usersController;