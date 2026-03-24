import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { getStoredUser } from "../lib/auth";
import { currency, formatDate } from "../lib/format";

function bookingTone(status) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function paymentTone(status) {
  switch (status) {
    case "paid":
      return "bg-sky-100 text-sky-700";
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "failed":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const user = getStoredUser();

      if (!user?.id) {
        setError("No signed-in user was found in local storage.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/bookings/user/${user.id}`);
        setBookings(response.data);
      } catch {
        setError("Could not load bookings for the current user.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <LoadingState label="Loading my trips" />;
  if (error) {
    return <ErrorState title="My trips unavailable" message={error} action={<Link to="/login" className="primary-button">Go to Login</Link>} />;
  }

  const totalBooked = bookings.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0);
  const pendingPayments = bookings.filter((booking) => booking.payment_status === "pending").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Traveler Space"
        title="Your bookings, payments, and trip history"
        description="This is the user-only trip area. Admin management lives separately in the admin console."
        compact
        actions={<Link to="/booking" className="primary-button">Create Another Booking</Link>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Total bookings</p>
          <p className="mt-3 text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Pending payments</p>
          <p className="mt-3 text-3xl font-bold">{pendingPayments}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Booked value</p>
          <p className="mt-3 text-3xl font-bold">{currency(totalBooked)}</p>
        </div>
      </section>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Once a traveler completes the booking flow, records will appear here."
          action={<Link to="/booking" className="primary-button">Make My First Booking</Link>}
        />
      ) : (
        <section className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="surface-card">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink-900/40">Booking number</p>
                  <h2 className="mt-2 text-2xl font-bold">{booking.booking_number}</h2>
                  <p className="mt-2 text-sm text-ink-900/60">Created {formatDate(booking.created_at)}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-sm text-ink-900/55">Total</p>
                  <p className="mt-1 text-3xl font-bold text-ocean-600">{currency(booking.total_amount)}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-sm text-ink-900/45">Destination</p>
                  <p className="mt-1 font-semibold">{booking.destination_name || "Not linked"}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-900/45">Hotel</p>
                  <p className="mt-1 font-semibold">{booking.hotel_name || "Not linked"}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-900/45">Flight</p>
                  <p className="mt-1 font-semibold">
                    {booking.airline ? `${booking.airline} ${booking.flight_number}` : "Not linked"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-900/45">Travel date</p>
                  <p className="mt-1 font-semibold">{formatDate(booking.travel_date)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`status-badge ${bookingTone(booking.booking_status)}`}>{booking.booking_status}</span>
                  <span className={`status-badge ${paymentTone(booking.payment_status)}`}>{booking.payment_status}</span>
                </div>
                {booking.payment_status === "pending" ? (
                  <Link to={`/payment?booking_id=${booking.id}&amount=${booking.total_amount}&booking_number=${booking.booking_number}`} className="primary-button">
                    Complete Payment
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Dashboard;
