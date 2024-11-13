import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/EditDiscount.css";

function EditDiscount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState({
    id: id,
    discountAmount: 0,
    discountPercentage: 0,
    expirationDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]:
        name === "discountAmount" || name === "discountPercentage"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(`https://localhost:7277/api/Discount`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(discount),
      });

      if (!response.ok) {
        throw new Error("Failed to update discount");
      } else {
        alert("Discount updated successfully");
        navigate(`/discounts/view/${id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="edit-discount-loading">Loading...</div>;
  if (error) return <div className="edit-discount-error">Error: {error}</div>;

  return (
    <div className="edit-discount-container">
      <h2 className="edit-discount-title">Edit Discount</h2>
      <div className="edit-discount-form">
        <label>
          Discount Amount:
          <input
            type="number"
            name="discountAmount"
            value={discount.discountAmount}
            onChange={handleInputChange}
            className="edit-discount-input"
          />
        </label>
        <label>
          Discount Percentage:
          <input
            type="number"
            name="discountPercentage"
            value={discount.discountPercentage}
            onChange={handleInputChange}
            className="edit-discount-input"
          />
        </label>
        <label>
          Expiration Date:
          <input
            type="date"
            name="expirationDate"
            value={discount.expirationDate.split("T")[0]}
            onChange={handleInputChange}
            className="edit-discount-input"
          />
        </label>
        <div className="edit-discount-actions">
          <button onClick={handleSave} className="btn-save">
            Save
          </button>
          <button
            onClick={() => navigate(`/discounts/view/${id}`)}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDiscount;
