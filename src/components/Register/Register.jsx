import React, { useState } from "react";
import Login from "../Login/Login";
import { Alert } from "antd";

function Register() {
  //Aqui es donde se va a almacenar cada dato del formulario
  const [users, setUsers] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState({
    cmpInc: false,
    problem: false,
    register: false,
    error: false,
  });

  function timer() {
    setTimeout(() => {
      setAlerts((alerts) => ({
        ...alerts,
        cmpInc: false,
        problem: false,
        register: false,
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

  function inpEmail(e) {
    setEmail(e.target.value);
  }

  //Evaluamos si alguna de los estados no esta definido y si es asi se indica
  //que existen datos incompletos

  async function register() {
    if (!users || !password || !email) {
      setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
      timer();
      return;
    }
    const data = { users, password, email }; //se declaran las variables como objetos

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setAlerts((alerts) => ({ ...alerts, problem: true }));
        timer();
        return;
      }
      setAlerts((alerts) => ({ ...alerts, register: true }));
      timer();
    } catch (error) {
      console.error("Error al enviar los datos" + error);
      setAlerts((alerts) => ({ ...alerts, error: true }));
      timer();
    }
  }

  const [view, setView] = useState(true);

  return (
    <div>
      {view && (
        <div className="container">
          <img className="logo" src="/img/OrbiNombre.png" />

          <div className="form">
            <h1>Register</h1>
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

              <input
                id="email"
                type="email"
                name="email"
                className="input"
                placeholder="Email address"
                onChange={(e) => inpEmail(e)}
              />
              {alerts.cmpInc && (
                <Alert
                  className="alerts"
                  type="warning"
                  title="Incomplete fields"
                />
              )}
              {alerts.problem && (
                <Alert
                  className="alerts"
                  type="error"
                  title="User or email exiting"
                />
              )}
              {alerts.register && (
                <Alert
                  className="alerts"
                  type="success"
                  title="Registered user"
                />
              )}
              {alerts.error && (
                <Alert
                  className="alerts"
                  type="error"
                  title="Error registering user"
                />
              )}
              <div className="buttons">
                <button type="button" onClick={() => setView(!view)}>
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    register();
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!view && <Login />}
    </div>
  );
}

export default Register;
