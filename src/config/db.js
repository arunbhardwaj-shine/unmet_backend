import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

  const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    namedPlaceholders: true,
  });

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err.message);
    } else {
      console.log('Database connection established successfully');
      connection.release();
    }
  });
export default db;
