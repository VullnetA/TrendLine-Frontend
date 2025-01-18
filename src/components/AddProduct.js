import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "./fetchWithAuth";
import "../style/FormStyles.css";

function AddProduct({ onLogout }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gender, setGender] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [colorId, setColorId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [discountId, setDiscountId] = useState("");
  const [error, setError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    setBrands([
      { id: 1, name: "Adidas" },
      { id: 2, name: "Nike" },
      { id: 3, name: "Zara" },
      { id: 4, name: "Levi's" },
      { id: 5, name: "H&M" },
    ]);
    setCategories([
      { id: 1, name: "Casual Wear" },
      { id: 2, name: "Formal Wear" },
      { id: 3, name: "Sports Wear" },
      { id: 4, name: "Outerwear" },
      { id: 5, name: "Footwear" },
    ]);
    setColors([
      { id: 1, name: "Denim Blue" },
      { id: 2, name: "Heather Gray" },
      { id: 3, name: "Olive Green" },
      { id: 4, name: "Mustard Yellow" },
      { id: 5, name: "Rust" },
      { id: 6, name: "Burgundy" },
      { id: 7, name: "Navy" },
      { id: 8, name: "Dusty Rose" },
    ]);
    setSizes([
      { id: 1, label: "XXS" },
      { id: 2, label: "XS" },
      { id: 3, label: "S" },
      { id: 4, label: "M" },
      { id: 5, label: "L" },
      { id: 6, label: "XL" },
      { id: 7, label: "XXL" },
      { id: 8, label: "XXXL" },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !gender ||
      !brandId ||
      !categoryId ||
      !colorId ||
      !sizeId
    ) {
      setError("All fields except Discount ID are required.");
      return;
    }

    const variables = {
      input: {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        gender,
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        colorId: Number(colorId),
        sizeId: Number(sizeId),
        discountId: discountId ? Number(discountId) : null,
      },
    };

    const query = `
      mutation AddProduct($input: AddProductDTOInput!) {
        addProduct(input: $input) {
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

    try {
      const result = await fetchWithAuth("https://localhost:7277/graphql", {
        method: "POST",
        body: JSON.stringify({ query, variables }),
      });

      // Reset form and show success message
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setGender("");
      setBrandId("");
      setCategoryId("");
      setColorId("");
      setSizeId("");
      setDiscountId("");
      setError(null);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="add-container">
        <h1 className="add-title">Add Product</h1>
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
            <label className="add-label">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NEUTRAL">Neutral</option>
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
          <div className="add-form-group">
            <label className="add-label">Discount ID:</label>
            <input
              type="number"
              value={discountId}
              onChange={(e) => setDiscountId(e.target.value)}
              className="add-input"
            />
          </div>
          <button type="submit" className="add-button">
            Add Product
          </button>
        </form>
        {error && <p className="add-error">{error}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
