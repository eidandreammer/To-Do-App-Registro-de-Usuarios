//Importar librerias
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // <-- OJO: Pool con P mayúscula

//Crear la app de express
const app = express();

//Configuracion basica
const port = 3000;

//Middlewares
app.use(cors()); //Permite que react pueda llamar a este servidor
app.use(express.json()); //Permite leer JSON en req.body

//Configurar conexion a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "registro",
  password: "0000",
  port: 5432,
});

//Ruta de read (Obtener todos los items)
//Get /api/items
app.post("/api/register", async (req, res) => {
  const { users, password, email } = req.body;

  try {
    const newUser = await pool.query(
      "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *",
      [users, password, email]
    );

    res.status(200).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
    });
    console.log("Error al registrar usuario");
  }
});

app.post("/api/register", async (req, res) => {
  const { users, password, email } = req.body;

  try {
    //Validacion de usuario
    const logg = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2 AND email = $3",
      [users, password, email]
    );

    if (logg.rows.length === 1) {
      return res.status(200).json({
        data: logg,
        success: true,
      });
    }
  } catch (errro) {
    res.status(500).json({
      message: "Error del lado del servidor",
      success: false,
    });
  }
});

//El servidor esta escuchando
app.listen(port, () => {
  console.log("El servidor esta escuchando en el puerto " + port);
});
