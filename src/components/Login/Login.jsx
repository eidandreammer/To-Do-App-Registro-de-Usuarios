import React, { useState } from "react";
import "./Login.css";

function Login() {
  //Aqui es donde se va a almacenar cada dato del formulario
  const [users, setUsers] = useState("");
  const [password, setPassword] = useState("");

  //Aqui es en donde se declara la funcion para llamarla y se actualice
  //el valor de cada estado con el contenido del input

  function inpUser(e) {
    setUsers(e.target.value);
  }

  function inpPassword(e) {
    setPassword(e.target.value);
  }
  async function login() {
    if (!users || !password) {
      return alert("Campos incompletos");
    }

    const data = { users, password };

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success && res.ok) {
        alert("Inicio de seccion exitoso");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("Error al iniciar seccion", error);
      alert("Error al inicciar seccion");
    }
  }

  //Evaluamos si alguna de los estados no esta definido y si es asi se indica
  //que existen datos incompletos

  return (
    <>
      <div className="card">
        <h1>Login form</h1>
        <div className="form">
          <form>
            <input
              type="text"
              name="text"
              className="input"
              placeholder="User"
              onChange={(e) => inpUser(e)}
            />
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              onChange={(e) => inpPassword(e)}
            />
            <div className="fgtpsw">
              <p>
                <a href="###">Forgot your password?</a>
              </p>
            </div>

            <div className="buttons">
              <button type="button" onClick={login}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
