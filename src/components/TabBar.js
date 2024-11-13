import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/TabBar.css";

function TabBar() {
  const navigate = useNavigate();

  return (
    <div className="tab-bar">
      <button className="tab-item" onClick={() => navigate("/view-products")}>
        Products
      </button>
      <button className="tab-item" onClick={() => navigate("/view-orders")}>
        Orders
      </button>
      <button className="tab-item" onClick={() => navigate("/view-catalogs")}>
        Catalogs
      </button>
      <button className="tab-item" onClick={() => navigate("/view-discounts")}>
        Discounts
      </button>
      <button className="tab-item" onClick={() => navigate("/view-customers")}>
        Customers
      </button>
      <button className="tab-item" onClick={() => navigate("/view-reports")}>
        Reports
      </button>
    </div>
  );
}

export default TabBar;
