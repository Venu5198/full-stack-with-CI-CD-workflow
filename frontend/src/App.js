import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ brand: "", model: "", year: "", price: "" });
  const [editId, setEditId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/cars";

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          brand: form.brand,
          model: form.model,
          year: parseInt(form.year),
          price: parseFloat(form.price),
        });
        setEditId(null);
      } else {
        await axios.post(API_URL, {
          brand: form.brand,
          model: form.model,
          year: parseInt(form.year),
          price: parseFloat(form.price),
        });
      }
      setForm({ brand: "", model: "", year: "", price: "" });
      fetchCars(); // Refresh table immediately
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  const handleEdit = (car) => {
    setForm({ brand: car.brand, model: car.model, year: car.year, price: car.price });
    setEditId(car._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🚗 Car Shop Management</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Brand" value={form.brand}
               onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        <input type="text" placeholder="Model" value={form.model}
               onChange={(e) => setForm({ ...form, model: e.target.value })} required />
        <input type="number" placeholder="Year" value={form.year}
               onChange={(e) => setForm({ ...form, year: e.target.value })} required />
        <input type="number" placeholder="Price" value={form.price}
               onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <button type="submit">{editId ? "Update Car" : "Add Car"}</button>
      </form>

      <h2>Available Cars</h2>
      {cars.length === 0 ? (
        <p>No cars available</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>₹{car.price}</td>
                <td>
                  <button onClick={() => handleEdit(car)}>Edit</button>
                  <button onClick={() => handleDelete(car._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
