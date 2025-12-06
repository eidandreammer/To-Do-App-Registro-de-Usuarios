import React from "react";
import "./Registro.css";

function registro() {
  return (
    <div className="card">
      <h1>Users form</h1>
      <div className="form">
        <form>
          <input
            type="text"
            name="text"
            className="input"
            placeholder="Name"
          />
          <input
            type="password"
            name="text"
            className="input"
            placeholder="Password"
          />

          <input
            id="email"
            type="email"
            name="text"
            className="input"
            placeholder="Email address"
          />

          <div className="buttons">
            <button>Sing In</button>
            <button>Sing Un</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default registro;
