import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../style/OrderDetailsStyles.css";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7277/api/Order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Order not found.");
          }
          throw new Error("Failed to fetch order details.");
        }

        const data = await response.json();
        setOrder(data);
        setNewStatus(data.status);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatusUpdateError("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7277/api/Order/${id}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the order status.");
      }

      setOrder((prevOrder) => ({
        ...prevOrder,
        status: newStatus,
      }));

      setStatusUpdateSuccess("Order status updated successfully.");
      setStatusUpdateError(null);
    } catch (err) {
      console.error("Status update error:", err);
      setStatusUpdateError(err.message);
      setStatusUpdateSuccess(null);
    }
  };

  if (loading) return <div className="order-details-loading">Loading...</div>;
  if (error) return <div className="order-details-error">Error: {error}</div>;

  return (
    <div className="order-details-container">
      {order ? (
        <>
          <h1 className="order-details-title">Order Details</h1>
          <p>Order ID: {order.id}</p>
          <p>Customer ID: {order.customerId}</p>
          <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
          <p>Status: {order.status}</p>

          <h2>Update Order Status</h2>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="status-dropdown"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={handleStatusChange} className="btn-update-status">
            Update Status
          </button>

          {statusUpdateSuccess && (
            <p className="status-update-success">{statusUpdateSuccess}</p>
          )}
          {statusUpdateError && (
            <p className="status-update-error">Error: {statusUpdateError}</p>
          )}

          <h2>Order Items</h2>
          {order.orderItems.length > 0 ? (
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  Product ID: {item.productId}, Quantity: {item.quantity},
                  Price: ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            "No items"
          )}
        </>
      ) : (
        <p>No order details available.</p>
      )}
    </div>
  );
}

export default OrderDetails;
