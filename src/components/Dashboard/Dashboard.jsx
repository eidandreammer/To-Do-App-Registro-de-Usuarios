import React from "react";

function PrincipalPanel() {
  return (
    <div>
      <div className="containerDashboard">
        <img className="logo" src="/img/OrbiNombre.png" />
        <form className="dashboardForm">
          <input
            type="text"
            placeholder="New Task"
            className="dashboardInput"
          />
          <button className="dashboardButton">
            ✔️
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrincipalPanel;
