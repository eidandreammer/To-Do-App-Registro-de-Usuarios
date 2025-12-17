import React, { useState } from "react";
import Login from "../Login/Login";

function Forgot() {
  const [email, setEmail] = useState("");
  const [view, setView] = useState(true);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [show, setShow] = useState(true);

  const [alerts, setAlerts] = useState({
    cmpInc: false,
    diferent: false,
    problem: false,
    change: false,
    error: false,
  });

  function timer() {
    setTimeout(() => {
      setAlerts(
        (alerts = {
          ...alerts,
          cmpInc: false,
          diferent: false,
          problem: false,
          change: false,
          error: false,
        })
      );
    }, 5000);
  }

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
        return alert(result.message);
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

  function inpPass1(e) {
    setPass1(e.target.value);
  }

  function inpPass2(e) {
    setPass2(e.target.value);
  }

  async function changePass() {
    const data = { pass1, email };

    if (!pass1 || !pass2) {
      function validation1() {
        setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
        timer();
      }

      return validation1();
    } else if (pass2 != pass1) {
      setAlerts((alerts) => ({ ...alerts, diferent: true }));
      timer();
    }

    try {
      const res = await fetch("http://localhost:3000/api/pass", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        function validation2() {
          setAlerts((alerts) => ({ ...alerts, problem: true }));
          timer();
        }

        return validation2();
      }

      setAlerts((alerts) => ({ ...alerts, change: true }));
      timer();
      function pass() {
        setShow(!show);
      }
      pass();
    } catch (error) {
      setAlerts((alerts) => ({ ...alerts, error: true }));
      timer();
    }
  }

  const [logg, setLogg] = useState(true);
  function login() {
    setLogg(!logg);
  }
  return (
    <div>
      {logg && (
        <div>
          {show && (
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
                      <button onClick={() => login()}>Login</button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          validate();
                        }}
                      >
                        Send
                      </button>
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
                      {alerts.cmpInc && (
                        <Alert
                          className="alerts"
                          type="warning"
                          title="Incomplete fields"
                        />
                      )}
                      <div className="button">
                        <button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            changePass();
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
          {!show && <Login />}
        </div>
      )}
      {!logg && <Login />}
    </div>
  );
}

export default Forgot;
