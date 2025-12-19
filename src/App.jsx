import React from "react";
import Login from "./components/Login/Login";
import "antd/dist/reset.css";
import "./App.css"

import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <div className="card">
      <Dashboard />
    </div>
  );
}
export default App;
