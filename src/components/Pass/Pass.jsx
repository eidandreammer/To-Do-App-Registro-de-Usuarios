import React, { useState } from "react";
import Login from "../Login/Login";

function Pass() {
  const [view, setView] = useState(true);
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
    } catch (error) {}
  }

  return (
    <div>
      {view && (
        <div className="container">
          <img className="logo" src="/img/OrbiNombre.png" />

          <div className="form">
            <form>
              <h1>Change password</h1>
        
              <div className="button">
                <button type="button" onClick={() => setView(!view)}>
                  Change
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

export default Pass;
