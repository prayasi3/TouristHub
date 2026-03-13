import { useState, useEffect } from "react";
import API from "../api/axios";

function TourGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    try {
      const res = await API.get("/tour-guides");
      setGuides(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  if (loading) return <p>Loading tour guides...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Tour Guides</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {guides.map((guide) => (
          <div key={guide.id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center"
          }}>
            
            <img
              src={guide.photo_url}
              alt={guide.name}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />

            <h3>{guide.name}</h3>

            <p><strong>Experience:</strong> {guide.experience} years</p>

            <p><strong>Languages:</strong> {guide.languages}</p>

            <p><strong>Specialties:</strong> {guide.specialties}</p>

            <p><strong>Rate:</strong> Rs. {guide.rate_per_hour} / hour</p>

            <p><strong>Contact:</strong> {guide.contact}</p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default TourGuides;