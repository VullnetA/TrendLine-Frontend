import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/ProductDetailsStyles.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://localhost:7277/api/Product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found.");
        }
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      const quantityData = await fetchProductQuantity(id);
      setProduct({ ...data, quantity: quantityData.currentQuantity });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductQuantity = async (productId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://localhost:7277/api/Product/quantity/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://localhost:7277/api/Product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Product deleted successfully");
        navigate("/view-products");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete product: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the product");
    }
  };

  if (loading) return <div className="product-details-loading">Loading...</div>;
  if (error) return <div className="product-details-error">Error: {error}</div>;

  return (
    <div className="product-details-container">
      <h1 className="product-details-title">Product Details</h1>
      {product && (
        <div className="product-details-content">
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </p>
          <p>
            <strong>Final Price:</strong> ${product.finalPrice.toFixed(2)}
          </p>
          <p>
            <strong>Quantity:</strong> {product.quantity}{" "}
            {/* Uses currentQuantity as quantity */}
          </p>
          <p>
            <strong>Gender:</strong> {product.gender}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Color:</strong> {product.color}
          </p>
          <p>
            <strong>Size:</strong> {product.size}
          </p>
          <div className="product-details-actions">
            <button
              onClick={() => navigate(`/product-stock/${product.id}`)}
              className="btn-quantity"
            >
              Update Quantity
            </button>
            <button
              onClick={() => navigate(`/products/edit/${product.id}`)}
              className="btn-edit"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn-delete">
              Delete
            </button>
          </div>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-back">
        Back
      </button>
    </div>
  );
}

export default ProductDetails;
