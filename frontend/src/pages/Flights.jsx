import { useEffect, useState } from "react";
import API from "../api/axios";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await API.get("/flights");
        setFlights(res.data);
      } catch (err) {
        console.error("Failed to fetch flights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading flights...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Available Flights
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center"
          }}
        >
          <thead>
            <tr style={{ background: "#0077b6", color: "white" }}>
              <th style={{ padding: "10px" }}>Airline</th>
              <th>Flight No</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{flight.airline}</td>
                <td>{flight.flight_number}</td>
                <td>{flight.source}</td>
                <td>{flight.destination}</td>
                <td>{flight.date}</td>
                <td>{flight.departure_time}</td>
                <td>{flight.arrival_time}</td>
                <td>${flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {flights.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No flights available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Flights;