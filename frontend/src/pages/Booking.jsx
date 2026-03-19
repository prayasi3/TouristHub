import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Booking() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedFlight, setSelectedFlight] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [nights, setNights] = useState(1);

  const [loading, setLoading] = useState(true);

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

  const selectedFlightObj = flights.find(f => f.id == selectedFlight);
  const selectedHotelObj = hotels.find(h => h.id == selectedHotel);

  const flightPrice = parseFloat(selectedFlightObj?.price || 0);
  const hotelPrice = parseFloat(selectedHotelObj?.price_per_night || 0);
  const nightsNum = parseInt(nights || 1);
  const total = flightPrice + hotelPrice * nightsNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const res = await API.post(
        "/bookings",
        {
          destinationId: selectedDestination,
          hotelId: selectedHotel,
          flightId: selectedFlight,
          travelDate,
          nights: nightsNum
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const bookingId = res.data.bookingId;

      // ✅ Booking successful message
      alert("Booking successful!");

      navigate(`/payment?booking_id=${bookingId}&amount=${total.toFixed(2)}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Booking</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        {/* Destination */}
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          required
          className="w-full border p-3"
        >
          <option value="">Select Destination</option>
          {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        {/* Hotel */}
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          required
          className="w-full border p-3"
        >
          <option value="">Select Hotel</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>
              {h.name} - ${h.price_per_night}/night
            </option>
          ))}
        </select>

        {/* Flight */}
        <select
          value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value)}
          required
          className="w-full border p-3"
        >
          <option value="">Select Flight</option>
          {flights.map(f => (
            <option key={f.id} value={f.id}>
              {f.airline} - ${f.price}
            </option>
          ))}
        </select>

        {/* Nights */}
        <div>
          <label className="block font-semibold mb-1">
            Number of Nights (Hotel is priced per night)
          </label>
          <input
            type="number"
            min="1"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            className="w-full border p-3"
            required
          />
        </div>

        {/* Travel Date */}
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="w-full border p-3"
          required
        />

        {/* Price Breakdown */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="font-bold mb-2">Price Breakdown</h3>
          <p>Flight: ${flightPrice}</p>
          <p>Hotel: ${hotelPrice} × {nightsNum} night(s) = ${hotelPrice * nightsNum}</p>
          <hr className="my-2" />
          <p className="font-bold">Total: ${total.toFixed(2)}</p>
        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;