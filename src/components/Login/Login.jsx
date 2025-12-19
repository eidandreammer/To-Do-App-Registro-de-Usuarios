import React, { useState } from "react";
import Register from "../Register/Register";
import Forgot from "../Forgot/Forgot";
import Dashboard from "../Dashboard/Dashboard";
import { Alert } from "antd";

function Login() {
  //Aqui es donde se va a almacenar cada dato del formulario
  const [users, setUsers] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const [pass, setPass] = useState(true);
  const [principal, setPrincipal] = useState(true);

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

  function logged() {
    setPrincipal(!principal);
  }

  async function login() {
    if (!users || !password) {
      setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
      timer();
      return;
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
        setAlerts((alerts) => ({ ...alerts, problem: true, cmpInc: false }));
        timer();
        return;
      }

      setAlerts((alerts) => ({ ...alerts, login: true, problem: false }));
      timer();
      logged();
    } catch (error) {
      console.log("Error al iniciar seccion", error);
      setAlerts((alerts) => ({ ...alerts, error: true, login: false }));
      timer();
    }
  }

  return (
    <div>
      {principal && (
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
                        <Alert
                          className="alerts"
                          title="Campos incompletos"
                          type="warning"
                        />
                      )}
                      {alerts.problem && (
                        <Alert
                          className="alerts"
                          title="Usuario o contrasena Incorrecta"
                          type="error"
                        />
                      )}
                      {alerts.login && (
                        <Alert
                          className="alerts"
                          title="Inicio de seccion exitoso"
                          type="success"
                        />
                      )}
                      {alerts.error && (
                        <Alert
                          className="alerts"
                          title="Error al iniciar seccion"
                          type="error"
                        />
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
                        <button
                        className="formButton"
                          type="button"
                          onClick={() => {
                            login();
                          }}
                        >
                          Login
                        </button>
                        <button
                        className="formButton"
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

              {!register && <Register />}
            </div>
          )}
          {!pass && <Forgot />}
        </div>
      )}
      {!principal && <PrincipalPanel />}
    </div>
  );
}

export default Login;
