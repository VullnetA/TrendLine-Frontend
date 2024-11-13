import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/CustomerDetailsStyles.css";

function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7277/api/Customer/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Customer not found.");
          }
          if (response.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          }
          throw new Error("Failed to fetch customer details.");
        }

        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://localhost:7277/api/Customer/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Customer deleted successfully");
        navigate("/view-customers");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete customer: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the customer");
    }
  };

  if (loading)
    return <div className="customer-details-loading">Loading...</div>;
  if (error)
    return <div className="customer-details-error">Error: {error}</div>;

  return (
    <div className="customer-details-container">
      <h1 className="customer-details-title">Customer Details</h1>
      {customer && (
        <div className="customer-details-content">
          <p>
            <strong>ID:</strong> {customer.userId}
          </p>
          <p>
            <strong>First Name:</strong> {customer.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {customer.lastName}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {customer.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {customer.address}
          </p>
        </div>
      )}

      <div className="customer-details-actions">
        <button onClick={handleDelete} className="btn-delete">
          Delete
        </button>
        <button onClick={() => navigate(-1)} className="btn-back">
          Back
        </button>
      </div>
    </div>
  );
}

export default CustomerDetails;
