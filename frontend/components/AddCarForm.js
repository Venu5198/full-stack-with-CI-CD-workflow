import React, { useState } from "react";
import axios from "axios";

function AddCarForm({ onCarAdded }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/cars", {
        brand,
        model,
        year: parseInt(year),
        price: parseFloat(price),
      });
      onCarAdded();
      setBrand("");
      setModel("");
      setYear("");
      setPrice("");
    } catch (err) {
      console.error("Error adding car:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <input
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit">Add Car</button>
    </form>
  );
}

export default AddCarForm;
