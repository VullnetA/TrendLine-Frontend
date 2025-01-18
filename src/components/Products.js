import React, { useState, useEffect } from "react";
import "../style/ProductStyles.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchParams, setSearchParams] = useState({
    category: "",
    gender: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    size: "",
    color: "",
    inStock: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const query = `
        query {
          getProducts {
            id
            name
            description
            price
            finalPrice
            quantity
            gender
            brand
            category
            color
            size
          }
        }
      `;

      const response = await fetch("https://localhost:7277/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error(result.errors[0].message); // Display the first error message
      }

      if (!result.data || !result.data.getProducts) {
        throw new Error("No products found.");
      }

      setProducts(result.data.getProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product"); // Navigate to the AddProduct component
  };

  const fetchProducts = async (queryParams = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(
        `https://localhost:7277/api/Product/search${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        handleFetchErrors(response);
      } else {
        const data = await response.json();
        setProducts(data);
        setSearchPerformed(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchErrors = (response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    if (response.status === 400) {
      throw new Error(
        "Invalid search parameters. Please review your search criteria."
      );
    }
    throw new Error("Failed to fetch products");
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const sanitizedParams = getSanitizedSearchParams(searchParams);
    const queryParams = buildQueryString(sanitizedParams);
    fetchProducts(queryParams);
  };

  const getSanitizedSearchParams = (params) => ({
    Category: params.category || undefined,
    Gender: params.gender || undefined,
    Brand: params.brand || undefined,
    PriceMin: params.priceMin ? Number(params.priceMin) : undefined,
    PriceMax: params.priceMax ? Number(params.priceMax) : undefined,
    Size: params.size || undefined,
    Color: params.color || undefined,
    InStock: params.inStock !== "" ? params.inStock === "true" : undefined,
  });

  const buildQueryString = (params) => {
    return (
      "?" +
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&")
    );
  };

  const handleResetSearch = () => {
    setSearchParams({
      category: "",
      gender: "",
      brand: "",
      priceMin: "",
      priceMax: "",
      size: "",
      color: "",
      inStock: "",
    });
    fetchAllProducts();
  };

  if (loading) return <div className="products-loading">Loading...</div>;
  if (error) return <div className="products-error">Error: {error}</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">Product List</h1>
        <button className="add-product-button" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-fields">{renderSearchFields()}</div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {searchPerformed && (
        <button onClick={handleResetSearch} className="reset-button">
          Cancel Search
        </button>
      )}
      {renderProductTable()}
    </div>
  );

  function renderSearchFields() {
    return (
      <>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={searchParams.category}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={searchParams.gender}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={searchParams.brand}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={searchParams.priceMin}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={searchParams.priceMax}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={searchParams.size}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={searchParams.color}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          name="inStock"
          value={searchParams.inStock}
          onChange={handleSearchChange}
          className="search-input"
        >
          <option value="">Stock Status</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </>
    );
  }

  function renderProductTable() {
    if (products.length === 0) {
      return <p className="products-empty">No products available.</p>;
    }

    return (
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Gender</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Color</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.finalPrice.toFixed(2)}</td>
              <td>{product.gender}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.color}</td>
              <td>{product.size}</td>
              <td>
                <button
                  onClick={() => navigate(`/products/view/${product.id}`)}
                  className="btn-view"
                >
                  Product Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Products;
