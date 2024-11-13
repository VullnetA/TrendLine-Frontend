import React, { useState, useEffect } from "react";
import "../style/CustomerStyles.css";
import { useNavigate } from "react-router-dom";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch("https://localhost:7277/api/Customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized. Please log in again.");
        throw new Error("Failed to fetch customers.");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="customers-container">
      <h1>Customers</h1>
      <table className="customers-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.userId}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.address}</td>
              <td>
                <button
                  onClick={() => navigate(`/customers/view/${customer.userId}`)}
                  className="btn-view"
                >
                  Customer Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
