import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ErrorState, LoadingState } from "../components/StatusView";
import { currency, formatDate, formatTime } from "../lib/format";

function Booking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({
    destinationId: "",
    hotelId: "",
    flightId: "",
    travelDate: "",
    nights: 1,
  });

  useEffect(() => {
    async function load() {
      try {
        const [destinationsResponse, hotelsResponse, flightsResponse] = await Promise.all([
          API.get("/destinations"),
          API.get("/hotels"),
          API.get("/flights"),
        ]);

        setDestinations(destinationsResponse.data);
        setHotels(hotelsResponse.data);
        setFlights(flightsResponse.data);
      } catch {
        setError("Could not load booking dependencies from the backend.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const selectedDestination = useMemo(
    () => destinations.find((destination) => String(destination.id) === String(form.destinationId)),
    [destinations, form.destinationId],
  );
  const selectedHotel = useMemo(
    () => hotels.find((hotel) => String(hotel.id) === String(form.hotelId)),
    [form.hotelId, hotels],
  );
  const selectedFlight = useMemo(
    () => flights.find((flight) => String(flight.id) === String(form.flightId)),
    [flights, form.flightId],
  );

  const hotelCost = Number(selectedHotel?.price_per_night || 0) * Number(form.nights || 1);
  const flightCost = Number(selectedFlight?.price || 0);
  const total = hotelCost + flightCost;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage("");
    setForm((current) => ({
      ...current,
      [name]: name === "nights" ? Math.max(1, Number(value) || 1) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await API.post("/bookings", {
        ...form,
        nights: Number(form.nights),
      });

      navigate(
        `/payment?booking_id=${response.data.bookingId}&amount=${response.data.totalAmount}&booking_number=${response.data.bookingNumber}`,
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Preparing booking workspace" />;
  if (error) return <ErrorState title="Booking unavailable" message={error} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-ink-950/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink-950 sm:text-5xl">
            Create Booking
          </h1>
          <p className="mt-3 text-lg text-ink-900/65">Plan your perfect trip to Nepal</p>
        </div>
        <div className="flex gap-3">
          <Link to="/my-trips" className="secondary-button">My Trips</Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl rounded-[28px] border border-ink-950/10 bg-white px-6 py-7 shadow-[0_20px_60px_-40px_rgba(15,23,32,0.25)] sm:px-8">
        <h2 className="text-2xl font-semibold text-ink-950">Booking Details</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="label-text" htmlFor="destinationId">Destination</label>
            <select
              id="destinationId"
              name="destinationId"
              value={form.destinationId}
              onChange={handleChange}
              className="input-shell"
              required
            >
              <option value="">Select a destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name} {destination.location ? `• ${destination.location}` : ""}
                </option>
              ))}
            </select>
            {selectedDestination ? (
              <p className="mt-2 text-sm text-ink-900/55">{selectedDestination.description}</p>
            ) : null}
          </div>

          <div>
            <label className="label-text" htmlFor="hotelId">Hotel</label>
            <select
              id="hotelId"
              name="hotelId"
              value={form.hotelId}
              onChange={handleChange}
              className="input-shell"
              required
            >
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} {hotel.location ? `• ${hotel.location}` : ""} • {currency(hotel.price_per_night)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text" htmlFor="nights">Number of Nights</label>
            <input
              id="nights"
              name="nights"
              type="number"
              min="1"
              value={form.nights}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="flightId">Flight</label>
            <select
              id="flightId"
              name="flightId"
              value={form.flightId}
              onChange={handleChange}
              className="input-shell"
              required
            >
              <option value="">Select a flight</option>
              {flights.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.airline} • {flight.source} to {flight.destination} • {currency(flight.price)}
                </option>
              ))}
            </select>
            {selectedFlight ? (
              <p className="mt-2 text-sm text-ink-900/55">
                {formatDate(selectedFlight.date)} | {formatTime(selectedFlight.departure_time)} to {formatTime(selectedFlight.arrival_time)}
              </p>
            ) : null}
          </div>

          <div>
            <label className="label-text" htmlFor="travelDate">Travel Date</label>
            <input
              id="travelDate"
              name="travelDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.travelDate}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div className="rounded-2xl bg-[#f7f7f8] px-4 py-4 text-sm text-ink-900/70">
            <div className="flex items-center justify-between">
              <span>Hotel total</span>
              <span className="font-semibold text-ink-950">{currency(hotelCost)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Flight total</span>
              <span className="font-semibold text-ink-950">{currency(flightCost)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ink-950/10 pt-3">
              <span>Total</span>
              <span className="text-base font-semibold text-ink-950">{currency(total)}</span>
            </div>
          </div>

          {message ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#050414] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#111026] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating booking..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
