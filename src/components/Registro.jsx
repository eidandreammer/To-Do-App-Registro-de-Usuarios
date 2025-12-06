import React from "react";
import "./Registro.css";

function registro() {
  return (
    <div className="card">
      <h1>Users form</h1>
      <div className="form">
        <form>
          <div className="firstLine">
            <input
              type="email"
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
          </div>
          <input
            id="email"
            type="email"
            name="text"
            className="input"
            placeholder="Email address"
          />

          <div className="buttons">
            <button>Sing In</button>
            <button>Sing On</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default registro;
