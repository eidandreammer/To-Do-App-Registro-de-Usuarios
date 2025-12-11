import React, { useState } from "react";
import "./App.css";
import Registro from "./components/Registro/Registro";
import Login from "./components/Login/Login";

function App() {
  const [login, setLogin] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [show, setShow] = useState(true);

  return (
    <div>
      {show && (
        <div className="card">
          <h2>Do you have an acount?</h2>
          <div className="btn">
            <button
              onClick={() => {
                setLogin(!login);
                setShow(!show);
              }}
            >
              Yes
            </button>
            <button
              onClickCapture={() => {
                setRegistro(!registro);
                setShow(!show);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {login && <Login />}
      {registro && <Registro />}
    </div>
  );
}
export default App;
