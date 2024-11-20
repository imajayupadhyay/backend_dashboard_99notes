import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css"; // Custom styles
import Dashboard from "./components/Dashboard"; // Categories component
import Products from "./components/Products"; // Products component

function App() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="container mt-4">
      <h1 className="text-center">Admin Panel</h1>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {activeTab === "categories" && <Dashboard />}
        {activeTab === "products" && <Products />}
      </div>
    </div>
  );
}

export default App;
