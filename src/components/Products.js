import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: {
      author: "",
      originalPrice: "",
      discount: "",
      subject: "",
    },
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(null);

  const API_URL = "http://localhost:8080/products";
  const UPLOAD_URL = "http://localhost:8080/products/uploadImage";
  const CATEGORIES_API_URL = "http://localhost:8080/categories";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIES_API_URL);
      setCategories(response.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // Assuming the server returns the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  // Add a product
  const addProduct = async () => {

    const imageUrl = await uploadImage(); 

    const productData = {
      ...newProduct,
      imageUrl,
      description: JSON.stringify(newProduct.description), // Convert description object to JSON string
      category: { id: newProduct.categoryId }, // Include category ID in the expected format
    };

    try {
      await axios.post(API_URL, productData);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update a product
  const updateProduct = async (id) => {

    const imageUrl = imageFile ? await uploadImage() : newProduct.imageUrl;

    const productData = {
      ...newProduct,
      imageUrl,
      description: JSON.stringify(newProduct.description), // Convert description object to JSON string
      category: { id: newProduct.categoryId },
    };

    try {
      await axios.put(`${API_URL}/${id}`, productData);
      fetchProducts();
      resetForm();
      setEditing(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewProduct({
      name: "",
      description: {
        author: "",
        originalPrice: "",
        discount: "",
        subject: "",
      },
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
    });

    setImageFile(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="products">
      <h2>Add New Product</h2>
      <div className="form-group">
        {/* General Product Fields */}
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-2"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Price"
          className="form-control mb-2"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Stock"
          className="form-control mb-2"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setImageFile(e.target.files[0])} // Save the selected file
        />
         <select
          className="form-control mb-2"
          value={newProduct.categoryId}
          onChange={(e) =>
            setNewProduct({ ...newProduct, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Description Fields */}
        <h4>Description</h4>
        <input
          type="text"
          placeholder="Author"
          className="form-control mb-2"
          value={newProduct.description.author}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: {
                ...newProduct.description,
                author: e.target.value,
              },
            })
          }
        />
        <input
          type="text"
          placeholder="Original Price"
          className="form-control mb-2"
          value={newProduct.description.originalPrice}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: {
                ...newProduct.description,
                originalPrice: e.target.value,
              },
            })
          }
        />
        <input
          type="text"
          placeholder="Discount"
          className="form-control mb-2"
          value={newProduct.description.discount}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: {
                ...newProduct.description,
                discount: e.target.value,
              },
            })
          }
        />
        <input
          type="text"
          placeholder="Subject"
          className="form-control mb-2"
          value={newProduct.description.subject}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: {
                ...newProduct.description,
                subject: e.target.value,
              },
            })
          }
        />
        <button
          className="btn btn-warning"
          onClick={() => (editing ? updateProduct(editing) : addProduct())}
        >
          {editing ? "Update" : "Add"}
        </button>
      </div>

      <h3>Products</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditing(product.id);
                    setNewProduct({
                      name: product.name,
                      description: JSON.parse(product.description), // Parse JSON string to object
                      price: product.price,
                      stock: product.stock,
                      imageUrl: product.imageUrl,
                      categoryId: product.category.id,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(product.id)}
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

export default Products;
