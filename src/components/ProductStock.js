import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/ProductStockStyles.css";

function ProductStock() {
  const { id } = useParams();
  const [productStock, setProductStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateField, setShowUpdateField] = useState(false);
  const [newQuantity, setNewQuantity] = useState("");
  const navigate = useNavigate();

  const fetchProductStock = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7277/api/Product/quantity/${id}`,
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
          throw new Error("Product stock information not found.");
        }
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error("Failed to fetch product stock information");
      }

      const data = await response.json();
      setProductStock(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductStock();
  }, [id]);

  const handleUpdateQuantity = () => {
    setShowUpdateField(true);
  };

  const handleCancelUpdate = () => {
    setShowUpdateField(false);
    setNewQuantity("");
  };

  const handleQuantityChange = (e) => {
    setNewQuantity(e.target.value);
  };

  const handleSubmitQuantity = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7277/api/Product/quantity/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: parseInt(newQuantity, 10) }),
        }
      );

      if (response.ok) {
        alert("Quantity updated successfully");
        setShowUpdateField(false);
        setNewQuantity("");
        setLoading(true);
        await fetchProductStock();
      } else {
        const errorData = await response.json();
        alert(`Failed to update quantity: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating the quantity");
    }
  };

  if (loading) return <div className="product-stock-loading">Loading...</div>;
  if (error) return <div className="product-stock-error">Error: {error}</div>;

  return (
    <div className="product-stock-container">
      <h1 className="product-stock-title">Product Stock Details</h1>
      {productStock && (
        <div className="product-stock-content">
          <p>
            <strong>Product ID:</strong> {productStock.id}
          </p>
          <p>
            <strong>Name:</strong> {productStock.name}
          </p>
          <p>
            <strong>Initial Quantity:</strong> {productStock.initialQuantity}
          </p>
          <p>
            <strong>Sold Quantity:</strong> {productStock.soldQuantity}
          </p>
          <p>
            <strong>Current Quantity:</strong> {productStock.currentQuantity}
          </p>
        </div>
      )}
      {!showUpdateField && (
        <button onClick={handleUpdateQuantity} className="btn-update-stock">
          Update Quantity
        </button>
      )}
      {showUpdateField && (
        <div className="update-quantity-section">
          <input
            type="number"
            value={newQuantity}
            onChange={handleQuantityChange}
            placeholder="Enter new quantity"
            className="input-new-quantity"
          />
          <button onClick={handleSubmitQuantity} className="btn-submit">
            Submit
          </button>
          <button onClick={handleCancelUpdate} className="btn-cancel">
            Cancel
          </button>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-back">
        Back
      </button>
    </div>
  );
}

export default ProductStock;
