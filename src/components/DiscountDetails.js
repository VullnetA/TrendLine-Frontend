import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/DiscountDetails.css";

function DiscountDetails() {
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscountDetails();
  }, []);

  const fetchDiscountDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(
        `https://localhost:7277/api/Discount/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch discount details");
      } else {
        const data = await response.json();
        setDiscount(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(
        `https://localhost:7277/api/Discount/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete discount");
      } else {
        alert("Discount deleted successfully");
        navigate("/view-discounts");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="discount-loading">Loading...</div>;
  if (error) return <div className="discount-error">Error: {error}</div>;

  return (
    <div className="discount-details-container">
      <h2 className="discount-title">Discount Details</h2>
      {discount ? (
        <div className="discount-info">
          <p>
            <strong>Name:</strong> {discount.name}
          </p>
          <p>
            <strong>Amount:</strong> ${discount.discountAmount.toFixed(2)}
          </p>
          <p>
            <strong>Percentage:</strong> {discount.discountPercentage}%
          </p>
          <p>
            <strong>Expiration Date:</strong>{" "}
            {new Date(discount.expirationDate).toLocaleDateString()}
          </p>
          <div className="discount-actions">
            <button
              className="btn-edit"
              onClick={() => navigate(`/discounts/edit/${id}`)}
            >
              Edit
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p>No discount details available.</p>
      )}
    </div>
  );
}

export default DiscountDetails;
