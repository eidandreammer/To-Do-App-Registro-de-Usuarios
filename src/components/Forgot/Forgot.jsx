import React, { useState } from "react";

function Forgot() {
  const [email, setEmail] = useState("");
  const [view, setView] = useState(true);

  function inpEmail(e) {
    setEmail(e.target.value);
  }

  async function validate() {
    if (!email) {
      return alert("Ingrese el email asociado a su cuenta");
    }
    const data = { email };
    try {
      const res = await fetch("http://localhost:3000/api/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message);
      }

      function pass() {
        setView(!view);
      }

      alert("Validacion exitosa");
      pass();
    } catch (error) {
      alert(error + " al enviar los datos");
    }
  }

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  function inpPass1(e) {
    setPass1(e.target.value);
  }

  function inpPass2(e) {
    setPass2(e.target.value);
  }

  async function changePass() {
    const data = { pass1, pass2 };

    if (!pass1 || !pass2) {
      return alert("Campos incompletos");
    } else if (pass2 != pass1) {
      return alert("Las contrasenas no coinciden");
    }

    try {
      const res = await fetch("/api/pass", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = res.json;
      if (!result.success) {
        return alert(result.message);
      }
      alert(result.message);
    } catch (error) {
      alert(result.message);
    }
  }
  return (
    <div>
      <div className="container">
        <img className="logo" src="/img/OrbiNombre.png" />

        <div className="form">
          {view ? <h1>Registered email</h1> : <h1>Change password</h1>}
          <form>
            <input
              id="email"
              type="email"
              name="email"
              className="input"
              placeholder="Email address"
              onChange={(e) => inpEmail(e)}
            />

            {view && (
              <div className="buttons">
                <button>Login</button>
                <button onClick={() => validate()}>Send</button>
              </div>
            )}
            {!view && (
              <div className="psw">
                <input
                  type="password"
                  name="password"
                  className="input"
                  placeholder="New password"
                  onChange={(e) => inpPass1(e)}
                />
                <input
                  type="password"
                  name="password"
                  className="input"
                  placeholder="Confirm password"
                  onChange={(e) => inpPass2(e)}
                />

                <div className="button">
                  <button onClick={() => changePass()}>Change</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
