import { useEffect, useState } from "react";
import API from "../api/axios";

function Hotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await API.get("/hotels");
      setHotels(res.data);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Available Hotels</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {hotels.map((hotel) => {
          const image =
            hotel.images && hotel.images.split(",")[0]
              ? hotel.images.split(",")[0]
              : "https://via.placeholder.com/250";

          return (
            <div
              key={hotel.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3>{hotel.name}</h3>
                <p><strong>Location:</strong> {hotel.location}</p>
                <p><strong>Price:</strong> ${hotel.price_per_night} / night</p>
                <p><strong>Contact:</strong> {hotel.contact_info}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;