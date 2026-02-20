import { useState, useEffect } from "react";
import API from "../api/axios";

function Booking() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedFlight, setSelectedFlight] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await API.get("/destinations");
        const hotelRes = await API.get("/hotels");
        const flightRes = await API.get("/flights");

        setDestinations(destRes.data);
        setHotels(hotelRes.data);
        setFlights(flightRes.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/bookings", {
        destinationId: selectedDestination,
        hotelId: selectedHotel,
        flightId: selectedFlight,
        travelDate,
      });

      alert("Booking successful!");
      console.log(res.data);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed");
    }
  };

  if (loading) return <div className="p-10">Loading booking options...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Booking</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        {/* Destination */}
        <div>
          <label className="block font-semibold mb-1">Destination</label>
          <select
            className="w-full border p-3 rounded-lg"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            required
          >
            <option value="">Select Destination</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hotel */}
        <div>
          <label className="block font-semibold mb-1">Hotel</label>
          <select
            className="w-full border p-3 rounded-lg"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            required
          >
            <option value="">Select Hotel</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} - {h.location}
              </option>
            ))}
          </select>
        </div>

        {/* Flight */}
        <div>
          <label className="block font-semibold mb-1">Flight</label>
          <select
            className="w-full border p-3 rounded-lg"
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            required
          >
            <option value="">Select Flight</option>
            {flights.map((f) => (
              <option key={f.id} value={f.id}>
                {f.airline} - {f.flightNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Date */}
        <div>
          <label className="block font-semibold mb-1">Travel Date</label>
          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}

export default Booking;
