import React, { useState } from "react";
import Login from "../Login/Login";

function Registro() {
  //Aqui es donde se va a almacenar cada dato del formulario
  let [users, setUsers] = useState("");
  let [password, setPassword] = useState("");
  let [email, setEmail] = useState("");

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
      return alert("Campos incompletos");
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
        return alert(result.message);
      }

      alert("Usuario registrado con exito");
    } catch (error) {
      alert("Error al enviar los datos");
      console.error("Error al enviar los datos" + error);
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

export default Registro;
