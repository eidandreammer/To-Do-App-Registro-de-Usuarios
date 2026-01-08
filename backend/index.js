// Import required libraries
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Create the Express app
const app = express();

// Basic server configuration
const port = 3000;

// Middleware
app.use(cors()); // Allows React to call this server
app.use(express.json()); // Parses JSON bodies

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "registro",
  password: "0000",
  port: 5432,
});

// Handle new user registration
app.post("/api/register", async (req, res) => {
  // Pull the username, password, and email provided by the client
  const { users, password, email } = req.body;

  try {
    // Check if a user with the same username already exists
    const evaluate1 = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [users]
    );

    // Check if a user with the same email already exists
    const evaluate2 = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // Block registration when the username is taken
    if (evaluate1.rows.length > 0) {
      console.log("Registro bloqueado: el usuario ya existe");
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    // Block registration when the email is already used
    else if (evaluate2.rows.length > 0) {
      console.log(
        "Registro bloqueado: el correo ya esta asociado a un usuario"
      );
      return res.status(409).json({
        success: false,
        message: "Email already associated with a user",
      });
    }
    // Insert the new user into the database when both checks pass
    const newUser = await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [users, password, email]
    );

    // Respond with the created user data
    console.log("Registro exitoso para el usuario:", users);
    res.status(200).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Fallo al registrar usuario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
});

// Handle user login attempt
app.post("/api/login", async (req, res) => {
  // Pull the credentials sent by the client
  const { users, password, email } = req.body;

  try {
    // Verify that the username exists before checking the password
    const evaluate = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [users]
    );

    if (evaluate.rows.length === 0) {
      console.log("Inicio de sesion fallido: usuario no encontrado");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Validate that the supplied password matches the stored one
    const login = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [users, password]
    );

    if (login.rows.length === 0) {
      console.log("Inicio de sesion fallido: contrasena incorrecta");
      return res.status(200).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Return the user record when authentication succeeds
    console.log("Inicio de sesion exitoso para el usuario:", users);
    res.status(200).json({
      success: true,
      data: login.rows[0],
    });
  } catch (error) {
    console.error("Fallo del servidor en login:", error.message);
    res.status(500).json({
      success: false,
      message: "Server-side error",
    });
  }
});

// Validate that an email exists before allowing a password change
app.post("/api/change", async (req, res) => {
  // Extract the email from the request body
  const { email } = req.body;

  try {
    // Confirm that the email is registered in the database
    const change = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (change.rows.length === 1) {
      console.log("Cambio de contrasena permitido: correo encontrado");
      return res.status(200).json({
        success: true,
        data: change.rows[0],
      });
    }

    console.log("Cambio de contrasena bloqueado: correo no registrado");
    res.status(404).json({
      success: false,
      message: "Email not registered",
    });
  } catch (error) {
    // Catch-all for any database or server failures
    console.error("Fallo del servidor al validar correo:", error.message);
    res.status(500).json({
      success: false,
      message: "Server-side error",
    });
  }
});

// Update the stored password for a given email
app.put("/api/pass", async (req, res) => {
  // Grab the new password and associated email from the request
  const { pass1, email } = req.body;

  try {
    // Persist the new password for the user with the provided email
    const newPass = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [pass1, email]
    );

    if (!newPass) {
      console.log("Error al cambiar contrasena: actualizacion no realizada");
      return res.status(404).json({
        succes: false,
        message: "Error changing password",
      });
    }
    console.log("Contrasena cambiada correctamente para el correo:", email);
    res.status(200).json({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    console.error("Fallo del servidor al cambiar contrasena:", error.message);
    res.status(500).json({
      success: false,
      message: "Server-side error",
    });
  }
});

app.post("/api/dashboard", async (req, res) => {
  // Extract the username and task description from the request
  const { user, task } = req.body;

  const clearTask = task.trim().toLowerCase();

  const reviewTask = await pool.query(
    "SELECT task_name FROM tasks WHERE LOWER(TRIM(task_name)) = $1",
    [clearTask]
  );

  if (reviewTask.rows.length > 0) {
    const existingTask = reviewTask.rows[0].task_name.trim().toLowerCase();
    if (existingTask === clearTask) {
      return res.status(409).json({
        success: false,
        message: "The task is existing",
      });
    }
  }
  try {
    // Retrieve the database ID for the provided username
    const searchId = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [user]
    );

    if (!searchId.rows.length) {
      console.log("Creacion de tarea fallida: usuario no encontrado");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const id = searchId.rows[0].id;

    // Insert the new task linked to the user ID
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, task_name) VALUES ($1, $2) RETURNING *",
      [id, task]
    );

    if (newTask.rows.length < 1) {
      console.log("Creacion de tarea fallida: no se inserto la tarea");
      res.status(404).json({
        success: false,
        message: "Task can't be added",
      });
      return;
    }

    console.log("Tarea creada correctamente para el usuario:", user);
    res.status(200).json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    // Fallback for unexpected errors while creating the task
    console.error("Fallo del servidor al crear tarea:", error.message);
    res.status(500).json({
      success: false,
      message: "Server-Side error",
    });
  }
});

app.post("/api/dashboard/pending", async (req, res) => {
  const { user } = req.body;

  try {
    const id = await pool.query("SELECT id FROM users WHERE username = $1", [
      user,
    ]);
    const tasks = await pool.query(
      "SELECT task_name FROM tasks WHERE id = $1 AND task_status = false",
      [id]
    );

    if (tasks.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending tasks found",
      });
    }
    res.status(200).json({
      success: true,
      data: tasks.rows,
    });
  } catch (error) {}
});

// Start listening for requests
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
