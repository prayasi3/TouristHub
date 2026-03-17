// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const statusColors = {
  confirmed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
  paid:    "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  failed:  "bg-red-100 text-red-700",
};

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setError("Please log in to view your bookings."); return; }

        // Decode user id from JWT payload (simple base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId  = payload.id || payload.userId || payload.sub;

        const res = await API.get(`/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500 text-lg">Loading your bookings…</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">All your Nepal travel bookings in one place.</p>
        </div>
        <Link to="/booking"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
          + New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">✈️</p>
          <p className="text-lg">No bookings yet.</p>
          <Link to="/booking" className="text-blue-600 hover:underline mt-2 inline-block">
            Make your first booking →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Booking number</p>
                  <p className="font-mono font-semibold text-gray-800">{b.booking_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    NPR {Number(b.total_amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(b.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-400">Destination</p>
                  <p className="font-medium text-gray-700">{b.destination_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Travel date</p>
                  <p className="font-medium text-gray-700">
                    {b.travel_date
                      ? new Date(b.travel_date).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Hotel</p>
                  <p className="font-medium text-gray-700">{b.hotel_name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Flight</p>
                  <p className="font-medium text-gray-700">
                    {b.airline && b.flight_number ? `${b.airline} – ${b.flight_number}` : "—"}
                  </p>
                </div>
              </div>

              {/* Status badges + pay button */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[b.booking_status] ?? "bg-gray-100 text-gray-600"}`}>
                    {b.booking_status}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${paymentColors[b.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                    {b.payment_status}
                  </span>
                </div>
                {b.payment_status === "pending" && (
                  <Link to={`/payment?booking_id=${b.id}`}
                    className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    Pay Now
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;