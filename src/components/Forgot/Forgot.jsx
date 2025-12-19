import React, { useState } from "react";
import Login from "../Login/Login";
import { Alert } from "antd";

function Forgot() {
  // Stores the email entered for recovery validation
  const [email, setEmail] = useState("");
  // Controls whether the email step or password reset step is visible
  const [view, setView] = useState(true);
  // Holds the first new password input value
  const [pass1, setPass1] = useState("");
  // Holds the confirmation password input value
  const [pass2, setPass2] = useState("");
  // Decides if the forgot flow or the login component is displayed
  const [show, setShow] = useState(true);

  // Centralized flags that toggle the inline alerts shown to the user
  const [alerts, setAlerts] = useState({
    email: false, // Email field missing
    noUsed: false, // Email not found in backend
    used: false, // Email validated successfully
    emailError: false, // Error while validating email
    cmpInc: false, // Missing password fields
    diferent: false, // Passwords mismatch
    problem: false, // Backend reported password change issue
    change: false, // Password changed successfully
    error: false, // Error while changing password
  });

  // Clear every alert after a short delay to avoid permanent banners
  function timer() {
    setTimeout(() => {
      setAlerts((alerts) => ({
        ...alerts,
        email: false,
        noUsed: false,
        emailError: false,
        used: false,
        cmpInc: false,
        diferent: false,
        problem: false,
        change: false,
        error: false,
      }));
    }, 5000);
  }

  // Update email state when user types
  function inpEmail(e) {
    setEmail(e.target.value);
  }

  // Flip to the password change view
  function pass() {
    setView(!view);
  }

  // Validate email submission and switch to the password reset view
  async function validate() {
    // Guard: require an email before hitting the API
    if (!email) {
      setAlerts((alerts) => ({ ...alerts, email: true }));
      timer();
      return;
    }
    const data = { email };
    try {
      const res = await fetch("http://localhost:3000/api/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // If backend says the email is not registered, show warning
      if (!result.success) {
        setAlerts((alerts) => ({ ...alerts, noUsed: true, email: false }));
        timer();
        return;
      }
      // Acknowledge the valid email before proceeding
      setAlerts((alerts) => ({ ...alerts, used: true, noUsed: false }));
      timer();
      pass();
    } catch (error) {
      // Network or server failure while validating email
      setAlerts((alerts) => ({ ...alerts, emailError: true, used: false }));
      timer();
    }
  }

  // Update first password input
  function inpPass1(e) {
    setPass1(e.target.value);
  }

  // Update second password input
  function inpPass2(e) {
    setPass2(e.target.value);
  }

  // Submit the new password when both inputs match
  async function changePass() {
    const data = { pass1, email };

    // Guard: both password fields must be filled
    if (!pass1 || !pass2) {
      setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
      timer();
      return;
    } else if (pass2 != pass1) {
      // Guard: passwords must match before submission
      setAlerts((alerts) => ({ ...alerts, diferent: true, cmpInc: false }));
      timer();
      return;
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
      // Backend could not change the password
      if (!result.success) {
        function validation3() {
          setAlerts((alerts) => ({
            ...alerts,
            problem: true,
            diferent: false,
          }));
          timer();
        }

        return validation3();
      }

      // Password was changed successfully, show success and go back to login
      setAlerts((alerts) => ({ ...alerts, change: true, problem: false }));
      timer();
      function pass() {
        setShow(!show);
      }
      pass();
    } catch (error) {
      // Network or server failure while changing password
      setAlerts((alerts) => ({ ...alerts, error: true, change: false }));
      timer();
    }
  }

  // Toggle between the reset flow and the main login screen
  const [logg, setLogg] = useState(true);
  function login() {
    setLogg(!logg);
  }

  // Send user back to the main login screen when the logo is clicked
  function handleLogoClick() {
    setLogg(false);
  }
  return (
    <div>
      {/* Render forgot-password flow when logg is true */}
      {logg && (
        <div>
          {/* Show the forgot-password screens until reset is finished */}
          {show && (
            <div className="container">
              <img
                className="logo"
                src="/img/OrbiNombre.png"
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              />

              <div className="form">
                {/* Heading switches between email validation and password change */}
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
                  {/* Alert: missing email */}
                  {alerts.email && (
                    <Alert
                      className="alerts"
                      type="warning"
                      title="Incomplete field"
                    />
                  )}
                  {/* Alert: email not found */}
                  {alerts.noUsed && (
                    <Alert
                      className="alerts"
                      type="warning"
                      title="Email is not registered"
                    />
                  )}
                  {/* Alert: server error */}
                  {alerts.emailError && (
                    <Alert
                      className="alerts"
                      type="error"
                      title="Server-side error"
                    />
                  )}
                  {/* Buttons when still on the email validation step */}
                  {view && (
                    <div className="buttons">
                      <button className="formButton" onClick={() => login()}>
                        Login
                      </button>
                      <button
                        className="formButton"
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
                  {/* Password change form once email is validated */}
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

                      {/* Alert: email confirmed */}
                      {alerts.used && (
                        <Alert
                          className="alerts"
                          type="success"
                          title="Email confirmed"
                        />
                      )}
                      {/* Alert: missing passwords */}
                      {alerts.cmpInc && (
                        <Alert
                          className="alerts"
                          type="warning"
                          title="Incomplete fields"
                        />
                      )}
                      {/* Alert: mismatch */}
                      {alerts.diferent && (
                        <Alert
                          className="alerts"
                          type="error"
                          title="Passwords do not match"
                        />
                      )}
                      {/* Alert: backend problem updating password */}
                      {alerts.problem && (
                        <Alert
                          className="alerts"
                          type="error"
                          title="Problem updating the password"
                        />
                      )}
                      {/* Alert: password changed */}
                      {alerts.change && (
                        <Alert
                          className="alerts"
                          type="success"
                          title="Password changed"
                        />
                      )}
                      {/* Alert: server error while changing password */}
                      {alerts.error && (
                        <Alert
                          className="alerts"
                          type="error"
                          title="Server-side error"
                        />
                      )}

                      <div className="buttons">
                        <button
                          className="formButton"
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
          {/* After successful reset, render the Login component */}
          {!show && <Login />}
        </div>
      )}
      {/* When logg is false, show the Login component directly */}
      {!logg && <Login />}
    </div>
  );
}

export default Forgot;
