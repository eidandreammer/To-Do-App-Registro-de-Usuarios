import React, { useState } from "react";
import { Alert } from "antd";

function Dashboard({ user }) {
  const [task, setTask] = useState("");
  const [alerts, setAlerts] = useState({
    cmpInc: false,
    badTask: false,
    badServer: false,
    addTask: false,
  });

  function timer() {
    setTimeout(() => {
      setAlerts((alerts) => ({
        ...alerts,
        cmpInc: false,
        badTask: false,
        badServer: false,
        addTask: false,
      }));
    }, 5000);
  }

  async function newTask() {
    if (!task.trim()) {
      setAlerts((alerts) => ({ ...alerts, cmpInc: true }));
      timer();
      return;
    }

    const data = { user, task };

    try {
      const res = await fetch("http://localhost:3000/api/dashboard", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        if (result.message === "Task can't be added") {
          setAlerts((alerts) => ({
            ...alerts,
            badTask: true,
            cmpInc: false,
            addTask: false,
          }));
          timer();
          return;
        }

        setAlerts((alerts) => ({
          ...alerts,
          badServer: true,
          badTask: false,
          cmpInc: false,
        }));
        timer();
        return;
      }

      setAlerts((alerts) => ({
        ...alerts,
        addTask: true,
        badServer: false,
        badServer: false,
      }));
      timer();
    } catch (error) {}
  }
  return (
    <div>
      <div className="containerDashboard">
        <img className="logo" src="/img/OrbiNombre.png" />
        <form className="dashboardForm">
          <div className="input-group">
            <input
              autoComplete="off"
              name="task"
              className="dashboardInput"
              type="task"
              placeholder="New task"
              onChange={(e) => {
                setTask(e.target.value);
              }}
            />
            <button
              className="dashboardButton"
              onClick={(e) => {
                e.preventDefault();
                newTask();
              }}
            >
              Add
            </button>
          </div>
        </form>
        <div className="dashboardAlertsContainer">
          <div className="dashboardAlertsContainer">
            {alerts.cmpInc && (
              <Alert
                className="dashboardAlerts"
                title="Incomplete fields"
                type="warning"
              />
            )}
          </div>
        </div>
        <div className="tasks">
          <div className="pendingTask">
            <h1>Pending task</h1>
            
          </div>
          <div className="completedTask">
            <h1>Completed task</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
