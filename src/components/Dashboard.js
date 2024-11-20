import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);

  const API_URL = "http://localhost:8080/categories";

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add a new category
  const addCategory = async () => {
    try {
      await axios.post(API_URL, newCategory);
      fetchCategories();
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Update a category
  const updateCategory = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, newCategory);
      fetchCategories();
      setEditing(null);
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete a category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="dashboard">
      <h2>Add New Categories</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-2"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          className="form-control mb-2"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <button
          className="btn btn-warning"
          onClick={() => (editing ? updateCategory(editing) : addCategory())}
        >
          {editing ? "Update" : "Add"}
        </button>
      </div>

      <h3>Categories</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditing(category.id);
                    setNewCategory({
                      name: category.name,
                      description: category.description,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
