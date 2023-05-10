import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const createConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT, // set to the port number of your MySQL server
  });

  return connection;
};

export default createConnection;
