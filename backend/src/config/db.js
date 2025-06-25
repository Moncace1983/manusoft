/*import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Cesar1983*",
    database: "mi_inventario",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db;*/

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: `utf8mb4`,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ping cada 5 minutos para mantener la conexión activa
setInterval(() => {
  db.query('SELECT 1').catch(err => console.error("Ping MySQL:", err));
}, 300000);

export default db;

