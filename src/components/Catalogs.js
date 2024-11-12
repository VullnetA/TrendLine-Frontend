import React, { useState, useEffect } from "react";
import "../style/CatalogsStyles.css";

function Catalogs() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState({});
  const [newEntry, setNewEntry] = useState({});

  const [editingItem, setEditingItem] = useState({
    brands: null,
    categories: null,
    colors: null,
    sizes: null,
  });
  const [editEntry, setEditEntry] = useState({
    brands: "",
    categories: "",
    colors: "",
    sizes: "",
  });

  const fetchCatalogData = async (endpoint, setData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://localhost:7277/api/Catalog/${endpoint}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }

      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData("brands", setBrands);
    fetchCatalogData("categories", setCategories);
    fetchCatalogData("colors", setColors);
    fetchCatalogData("sizes", setSizes);
  }, []);

  const handleAdd = (type) => {
    setShowAddForm((prev) => ({ ...prev, [type]: !prev[type] }));
    setNewEntry({});
  };

  const handleSave = async (type) => {
    const token = localStorage.getItem("token");

    if (!newEntry[type] || !token) {
      setError(`Please enter a valid ${type} value.`);
      return;
    }

    let bodyContent = { name: newEntry[type] };
    if (type === "sizes") {
      bodyContent = { label: newEntry[type] };
    }

    let endpoint = `https://localhost:7277/api/Catalog/${type}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        alert(
          `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
        );
        setNewEntry({});
        setShowAddForm((prev) => ({ ...prev, [type]: false }));
        fetchCatalogData(type, getTypeSetter(type));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add ${type}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem((prev) => ({ ...prev, [type]: item.id }));
    setEditEntry((prev) => ({ ...prev, [type]: item.name || item.label }));
  };

  const handleUpdate = async (id, type) => {
    const token = localStorage.getItem("token");

    if (!editEntry[type] || !token) {
      setError(`Please enter a valid ${type} value.`);
      return;
    }

    let bodyContent = { name: editEntry[type] };
    if (type === "sizes") {
      bodyContent = { label: editEntry[type] };
    }

    let endpoint = `https://localhost:7277/api/Catalog/${type}/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        alert(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
        );
        setEditingItem((prev) => ({ ...prev, [type]: null }));
        fetchCatalogData(type, getTypeSetter(type));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update ${type}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (id, type) => {
    const token = localStorage.getItem("token");

    if (!id) {
      console.error("No ID provided for delete request.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7277/api/Catalog/${type}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert(
          `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
        );
        fetchCatalogData(type, getTypeSetter(type)); // Refresh data after deletion
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const getTypeSetter = (type) => {
    switch (type) {
      case "brands":
        return setBrands;
      case "categories":
        return setCategories;
      case "colors":
        return setColors;
      case "sizes":
        return setSizes;
      default:
        return () => {};
    }
  };

  const renderSection = (data, type) => (
    <div className={`catalog-section ${type}-section`}>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <button onClick={() => handleAdd(type)} className="btn-add">
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
      {showAddForm[type] && (
        <form className="add-form">
          <input
            type="text"
            placeholder={`Enter new ${type} name`}
            value={newEntry[type] || ""}
            onChange={(e) =>
              setNewEntry({ ...newEntry, [type]: e.target.value })
            }
            className="input-add"
          />
          <button
            type="button"
            onClick={() => handleSave(type)}
            className="btn-save"
          >
            Save
          </button>
        </form>
      )}
      <ul className={`catalog-list ${type}-list`}>
        {data.map((item) => (
          <li key={item.id} className={`catalog-item ${type}-item`}>
            {editingItem[type] === item.id ? (
              <>
                <input
                  type="text"
                  value={editEntry[type] || ""}
                  onChange={(e) =>
                    setEditEntry({ ...editEntry, [type]: e.target.value })
                  }
                  className="input-edit"
                />
                <button
                  onClick={() => handleUpdate(item.id, type)}
                  className="btn-done"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <span>{item.name || item.label}</span>
                <div className="catalog-actions">
                  <button
                    onClick={() => handleEdit(item, type)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, type)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) return <div className="catalog-loading">Loading...</div>;
  if (error) return <div className="catalog-error">Error: {error}</div>;

  return (
    <div className="catalogs-container">
      {renderSection(brands, "brands")}
      {renderSection(categories, "categories")}
      {renderSection(colors, "colors")}
      {renderSection(sizes, "sizes")}
    </div>
  );
}

export default Catalogs;
