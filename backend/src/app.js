import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';
import productosRoutes from './routes/productosRoutes.js';
import salidasRoutes from './routes/salidasRoutes.js';
import entradaRoutes from './routes/entradaRoutes.js';
import informesRoutes from './routes/informesRoutes.js';

// Express
const app = express();
const PORT = process.env.PORT || 3002;

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://manusoft.vercel.app",
  "https://manusoft-git-master-moncaces-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
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

// Middleware de CORS con configuración correcta
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Para solicitudes preflight

// Middleware para ver el origen en consola (opcional, útil para depuración)
app.use((req, res, next) => {
  console.log(`Solicitud recibida desde: ${req.headers.origin}`);
  next();
});

// Middleware de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/users", usersRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/salidas", salidasRoutes);
app.use("/api/entradas", entradaRoutes);
app.use("/api/informes", informesRoutes);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
