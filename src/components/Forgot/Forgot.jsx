import React, { useState } from "react";
import Pass from "../Pass/Pass";

function Forgot() {
  const [email, setEmail] = useState("");
  const [view, setView] = useState(true);

  function inpEmail(e) {
    setEmail(e.target.value);
  }

  async function change() {
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
  return (
    <div>
      {view && (
        <div className="container">
          <img className="logo" src="/img/OrbiNombre.png" />
          
          <div className="form">
            <h1>Associated email</h1>
            <form>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                placeholder="Email address"
                onChange={(e) => inpEmail(e)}
              />

              <div className="buttons">
                <button onClick={() => change()}>Change password</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!view && <Pass />}
    </div>
  );
}

export default Forgot;
