import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OrdersStyles.css"; // Ensure you have this CSS file for styling

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch all orders initially
    const fetchAllOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`https://localhost:7277/api/Order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const fetchOrdersByDateRange = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please enter both start and end dates.");
      return;
    }

    setLoading(true);

    // Convert the dates to UTC format
    const startDateUTC = new Date(startDate).toISOString();
    const endDateUTC = new Date(endDate).toISOString();

    try {
      const response = await fetch(
        `https://localhost:7277/api/Order/dateRange?startDate=${startDateUTC}&endDate=${endDateUTC}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSearch = (e) => {
    e.preventDefault();

    if (new Date(startDate) >= new Date(endDate)) {
      setError("Start date must be earlier than end date.");
      return;
    }

    fetchOrdersByDateRange();
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/view/${orderId}`);
  };

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders List</h1>

      {/* Date range filter */}
      <form onSubmit={handleDateSearch} className="date-filter-form">
        <div>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        <button type="submit" className="btn-search">
          Search
        </button>
      </form>

      {loading && <div className="orders-loading">Loading...</div>}
      {error && <div className="orders-error">Error: {error}</div>}

      {orders.length === 0 && !loading ? (
        <p className="orders-empty">
          No orders found for the selected date range.
        </p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerId}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() => handleViewOrderDetails(order.id)}
                    className="btn-view-order"
                  >
                    View Order Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
