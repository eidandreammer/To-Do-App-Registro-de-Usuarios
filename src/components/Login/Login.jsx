import React, { useState } from "react";
import { Alert } from "antd";
import Registro from "../Registro/Registro";
import Forgot from "../Forgot/Forgot";

function Login() {
  //Aqui es donde se va a almacenar cada dato del formulario
  const [users, setUsers] = useState("");
  const [password, setPassword] = useState("");
  const [alerts, setAlerts] = useState({
    cmpInc: false,
    problem: false,
    login: false,
    error: false,
  });

  function timer() {
    setTimeout(() => {
      setAlerts((alerts) => ({
        ...alerts,
        cmpInc: false,
        problem: false,
        login: false,
        error: false,
      }));
    }, 5000);
  }
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
      function validation() {
        setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
        timer();
      }
      return validation();
    }

    const data = { users, password };

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        setAlerts((alerts) => ({ ...alerts, problem: true }));
        timer();
      } else if (result.succes) {
        setAlerts((alerts) => ({ ...alerts, login: true }));
        timer();
      }
    } catch (error) {
      console.log("Error al iniciar seccion", error);
      setAlerts((alerts) => ({ ...alerts, error: true }));
      timer();
    }
  }

  const [register, setRegister] = useState(true);
  const [pass, setPass] = useState(true);

  return (
    <div>
      {pass && (
        <div>
          {register && (
            <div className="container">
              <img className="logo" src="/img/OrbiNombre.png" />

              <div className="form">
                <h1>Login</h1>

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
                  {alerts.cmpInc && (
                    <Alert title="Campos incompletos" type="warning" />
                  )}
                  {alerts.problem && (
                    <Alert
                      title="Usuario o contrasena Incorrecta"
                      type="error"
                    />
                  )}
                  {alerts.login && (
                    <Alert title="Inicio de seccion exitoso" type="success" />
                  )}
                  {alerts.error && (
                    <Alert title="Error de parte del servidor" type="error" />
                  )}
                  <div className="fgtpsw">
                    <p>
                      <a
                        href="###"
                        onClick={() => {
                          setPass(!pass);
                        }}
                      >
                        Forgot your password?
                      </a>
                    </p>
                  </div>

                  <div className="buttons">
                    <button type="button" onClick={login}>
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegister(!register)}
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!register && <Registro />}
        </div>
      )}
      {!pass && <Forgot />}
    </div>
  );
}

export default Login;
