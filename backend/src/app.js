import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';
import productosRoutes from './routes/productosRoutes.js';
import salidasRoutes from './routes/salidasRoutes.js';
import entradaRoutes from './routes/entradaRoutes.js';
import informesRoutes from './routes/informesRoutes.js';

// Express
const app = express ();
const PORT = process.env.PORT || 3002;

//Configuracion de CORS
const allowedOrigins = [
  "http://localhost:5173",             // desarrollo local
  "https://manusoft.vercel.app",       // producción en Vercel
  "https://manusoft-git-master-moncaces-projects.vercel.app",   // Despliegue temporal en Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir sin origen (como Postman o curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

//Middlewares
app.use(cors(corsOptions));
app.use(express.json()); //Analizar datos JSON
app.use(express.urlencoded({ extended: true })); //Analizar datos de formularios

//Rutas
app.use("/api/users", usersRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/salidas", salidasRoutes);
app.use("/api/entradas", entradaRoutes);
app.use("/api/informes", informesRoutes);

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});