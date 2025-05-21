import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Cesar1983*",
    database: "mi_inventario",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db;
