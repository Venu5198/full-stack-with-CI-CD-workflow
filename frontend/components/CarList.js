import React from "react";

function CarList({ cars }) {
  if (cars.length === 0) {
    return <p>No cars found. Add one!</p>;
  }

  return (
    <div>
      {cars.map((car) => (
        <div key={car._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>
            {car.brand} {car.model} ({car.year})
          </h3>
          <p>💰 Price: ₹{car.price}</p>
        </div>
      ))}
    </div>
  );
}

export default CarList;
