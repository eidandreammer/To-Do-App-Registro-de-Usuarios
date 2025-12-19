import React, { useState } from "react";
import Login from "../Login/Login";
import { Alert } from "antd";

function Register() {
  // Store the username typed for registration
  const [users, setUsers] = useState("");
  // Store the password typed for registration
  const [password, setPassword] = useState("");
  // Store the email typed for registration
  const [email, setEmail] = useState("");
  // Toggle between the registration form and the login component
  const [view, setView] = useState(true);

  // Track alert flags related to the register form
  const [alerts, setAlerts] = useState({
    cmpInc: false, // Missing required fields
    problem: false, // Username or email already exists
    register: false, // Successful registration
    error: false, // Request error
  });

  // Auto-dismiss alerts so feedback does not linger forever
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

  // Update local state on each field change
  function inpUser(e) {
    setUsers(e.target.value);
  }

  // Update password when user types
  function inpPassword(e) {
    setPassword(e.target.value);
  }

  // Update email when user types
  function inpEmail(e) {
    setEmail(e.target.value);
  }
  // Send user to the login screen when clicking the logo
  function handleLogoClick() {
    setView(false);
  }
  // Validate inputs and send registration payload to the API
  async function register() {
    // Guard: require all fields before calling the API
    if (!users || !password || !email) {
      setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
      timer();
      return;
    }
    const data = { users, password, email };

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Show error when backend rejects creation
      if (!result.success) {
        setAlerts((alerts) => ({ ...alerts, problem: true }));
        timer();
        return;
      }
      // Indicate registration success
      setAlerts((alerts) => ({ ...alerts, register: true }));
      timer();
    } catch (error) {
      // Network or server error while registering
      console.error("Error sending data", error);
      setAlerts((alerts) => ({ ...alerts, error: true }));
      timer();
    }
  }

  return (
    <div>
      {/* Render registration form while view is true */}
      {view && (
        <div className="container">
          <img
            className="logo"
            src="/img/OrbiNombre.png"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />

          <div className="form">
            <h1>Register</h1>
            <form>
              <input
                type="text"
                name="text"
                className="input"
                placeholder="Username"
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
              {/* Alert: missing fields */}
              {alerts.cmpInc && (
                <Alert
                  className="alerts"
                  type="warning"
                  title="Incomplete fields"
                />
              )}
              {/* Alert: duplicate username or email */}
              {alerts.problem && (
                <Alert
                  className="alerts"
                  type="error"
                  title="Username or email already exists"
                />
              )}
              {/* Alert: registration success */}
              {alerts.register && (
                <Alert
                  className="alerts"
                  type="success"
                  title="User registered"
                />
              )}
              {/* Alert: request error */}
              {alerts.error && (
                <Alert
                  className="alerts"
                  type="error"
                  title="Error registering user"
                />
              )}
              <div className="buttons">
                <button
                  className="formButton"
                  type="button"
                  onClick={() => setView(!view)}
                >
                  Login
                </button>
                <button
                  className="formButton"
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

      {/* Render Login component when view is false */}
      {!view && <Login />}
    </div>
  );
}

export default Register;
