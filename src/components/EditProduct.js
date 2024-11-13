import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "./fetchWithAuth";
import "../style/FormStyles.css";

function EditProduct() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [colorId, setColorId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    setBrands([
      { id: 4, name: "Adidas" },
      { id: 5, name: "Nike" },
      { id: 6, name: "Zara" },
      { id: 7, name: "Levi's" },
      { id: 8, name: "H&M" },
    ]);
    setCategories([
      { id: 3, name: "Casual Wear" },
      { id: 4, name: "Formal Wear" },
      { id: 5, name: "Sports Wear" },
      { id: 6, name: "Outerwear" },
      { id: 7, name: "Footwear" },
    ]);
    setColors([
      { id: 3, name: "Denim Blue" },
      { id: 4, name: "Heather Gray" },
      { id: 5, name: "Olive Green" },
      { id: 6, name: "Mustard Yellow" },
      { id: 7, name: "Rust" },
      { id: 8, name: "Burgundy" },
      { id: 9, name: "Navy" },
      { id: 10, name: "Dusty Rose" },
    ]);
    setSizes([
      { id: 4, label: "XXS" },
      { id: 5, label: "XS" },
      { id: 6, label: "S" },
      { id: 7, label: "M" },
      { id: 8, label: "L" },
      { id: 9, label: "XL" },
      { id: 10, label: "XXL" },
      { id: 11, label: "XXXL" },
    ]);

    const fetchProduct = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetchWithAuth(
          `https://localhost:7277/api/Product/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setGender(data.gender);
          setBrandId(data.brandId);
          setCategoryId(data.categoryId);
          setColorId(data.colorId);
          setSizeId(data.sizeId);
        } else {
          setError("Failed to load product details");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred. Please try again.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !price ||
      !gender ||
      !brandId ||
      !categoryId ||
      !colorId ||
      !sizeId
    ) {
      setError("All fields are required.");
      return;
    }

    const updatedProductData = {
      name,
      description,
      price: Number(price),
      gender: Number(gender),
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      colorId: Number(colorId),
      sizeId: Number(sizeId),
    };

    try {
      const response = await fetchWithAuth(
        `https://localhost:7277/api/Product/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedProductData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/view-products");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="add-container">
        <h1 className="add-title">Edit Product</h1>
        <form onSubmit={handleSubmit} className="add-form">
          <div className="add-form-group">
            <label className="add-label">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="add-input"
              required
            />
          </div>
          <div className="add-form-group">
            <label className="add-label">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="add-input"
              required
            />
          </div>
          <div className="add-form-group">
            <label className="add-label">Price:</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="add-input"
              required
            />
          </div>
          <div className="add-form-group">
            <label className="add-label">Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="add-input"
              required
            >
              <option value="">Select Gender</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Neutral</option>
            </select>
          </div>
          <div className="add-form-group">
            <label className="add-label">Brand:</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="add-input"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label className="add-label">Category:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="add-input"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label className="add-label">Color:</label>
            <select
              value={colorId}
              onChange={(e) => setColorId(e.target.value)}
              className="add-input"
              required
            >
              <option value="">Select Color</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label className="add-label">Size:</label>
            <select
              value={sizeId}
              onChange={(e) => setSizeId(e.target.value)}
              className="add-input"
              required
            >
              <option value="">Select Size</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="add-button">
            Update Product
          </button>
        </form>
        {error && <p className="add-error">{error}</p>}
      </div>
    </div>
  );
}

export default EditProduct;
