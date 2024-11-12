import React, { useState, useEffect } from "react";
import "../style/Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://localhost:7277/api/Product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    const orderData = {
      orderItems: [
        {
          productId: productId,
          quantity: quantity,
          price: products.find((product) => product.id === productId).price,
        },
      ],
    };

    try {
      const response = await fetch("https://localhost:7277/api/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      alert("Order created successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="shop-loading">Loading...</div>;
  if (error) return <div className="shop-error">Error: {error}</div>;

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="btn-add-to-cart"
              >
                Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Shop;
