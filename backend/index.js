//Importar librerias
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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
    const evaluate1 = await pool.query("SELECT * FROM users WHERE name = $1", [
      users,
    ]);

    const evaluate2 = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (evaluate1.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Usuario existente",
      });
    } else if (evaluate2.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Correo asociado a usuario existente",
      });
    }
    const newUser = await pool.query(
      "INSERT INTO users (name, password, email) VALUES ($1, $2, $3)",
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

app.post("/api/login", async (req, res) => {
  const { users, password, email } = req.body;

  try {
    const evaluate = await pool.query("SELECT * FROM users WHERE name = $1", [
      users,
    ]);

    if (evaluate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado backend",
      });
    }
    const login = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [users, password]
    );

    if (login.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Contrasena incorrecta",
      });
    }

    res.status(404).json({
      success: true,
      data: login.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error de lado del servidor",
    });
  }
});

app.post("/api/change", async (req, res) => {
  const { email } = req.body;

  try {
    const change = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (change.rows.length === 1) {
      return res.status(200).json({
        success: true,
        data: change.rows[0],
      });
    }

    res.status(404).json({
      success: false,
      message: "Correo no registrado",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del lado del servidor",
    });
  }
});

app.put("/api/pass", async (req, res) => {
  const { pass1 } = req.body;

  try {
    const newPass = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [pass1]
    );

    if (!newPass) {
      return res.status(409).json({
        success: false,
        message: "Error al cambiar la contrasena",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contrasna cambiada",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del lado del servidor",
    });
  }
});

//El servidor esta escuchando
app.listen(port, () => {
  console.log("El servidor esta escuchando en el puerto " + port);
});
