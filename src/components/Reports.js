import React, { useState, useEffect } from "react";
import "../style/Reports.css";

function Reports() {
  const [dailySalesReport, setDailySalesReport] = useState(null);
  const [monthlySalesReport, setMonthlySalesReport] = useState(null);
  const [topProductsReport, setTopProductsReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport("daily-sales", setDailySalesReport);
    fetchReport("monthly-sales", setMonthlySalesReport);
    fetchReport("top-products", setTopProductsReport);
  }, []);

  const fetchReport = async (reportType, setReport) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7277/api/Report/${reportType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ${reportType} report`);
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderReportData = (data) => {
    if (!data || data.reportData === "[]") return <p>No data available.</p>;

    try {
      const reportItems = JSON.parse(data.reportData);
      return (
        <ul>
          {reportItems.map((item, index) => (
            <li key={index}>
              <strong>Product:</strong> {item.ProductName} <br />
              <strong>Quantity Sold:</strong> {item.QuantitySold} <br />
              <strong>Total Sales:</strong> ${item.TotalSales.toFixed(2)}
            </li>
          ))}
        </ul>
      );
    } catch (err) {
      return <p>Error parsing report data.</p>;
    }
  };

  return (
    <div className="reports-container">
      <h1>Reports Page</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="report-section">
        <h2>Daily Sales Report</h2>
        {dailySalesReport ? (
          renderReportData(dailySalesReport)
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="report-section">
        <h2>Monthly Sales Report</h2>
        {monthlySalesReport ? (
          renderReportData(monthlySalesReport)
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="report-section">
        <h2>Top Products Report</h2>
        {topProductsReport ? (
          renderReportData(topProductsReport)
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Reports;
