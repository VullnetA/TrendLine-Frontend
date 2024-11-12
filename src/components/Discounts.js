import React, { useState, useEffect } from "react";
import "../style/DiscountStyles.css";
import { useNavigate } from "react-router-dom";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDiscounts();
  }, []);

  const fetchAllDiscounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(`https://localhost:7277/api/Discount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      } else {
        const data = await response.json();
        setDiscounts(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="discounts-loading">Loading...</div>;
  if (error) return <div className="discounts-error">Error: {error}</div>;

  return (
    <div className="discounts-container">
      <h1 className="discounts-title">Discount List</h1>
      {renderDiscountTable()}
    </div>
  );

  function renderDiscountTable() {
    if (discounts.length === 0) {
      return <p className="discounts-empty">No discounts available.</p>;
    }

    return (
      <table className="discounts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Percentage</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td>{discount.name}</td>
              <td>${discount.discountAmount.toFixed(2)}</td>
              <td>{discount.discountPercentage}%</td>
              <td>{new Date(discount.expirationDate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => navigate(`/discounts/view/${discount.id}`)}
                  className="btn-view"
                >
                  Discount Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Discounts;
