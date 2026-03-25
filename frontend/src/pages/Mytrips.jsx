import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { getStoredUser, isAuthenticated } from "../lib/auth";
import { currency } from "../lib/format";

function formatBookingDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function paymentLabel(value) {
  if (!value) return "Payment method unavailable";

  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStoredBooking(booking, index) {
  const hotelPrice = Number(
    booking?.hotel?.price
      ?? booking?.hotel_price
      ?? booking?.hotelPrice
      ?? 0,
  );
  const flightPrice = Number(
    booking?.flight?.price
      ?? booking?.flight_price
      ?? booking?.flightPrice
      ?? 0,
  );
  const nights = Math.max(1, Number(booking?.nights ?? 1));
  const totalAmount = Number(
    booking?.totalAmount
      ?? booking?.total_amount
      ?? (hotelPrice * nights) + flightPrice,
  );

  return {
    id: booking?.id ?? `local-${index}`,
    bookingNumber: booking?.bookingNumber ?? booking?.booking_number ?? `LOCAL-${index + 1}`,
    destination: booking?.destination ?? booking?.destination_name ?? "Destination unavailable",
    hotelName: booking?.hotel?.name ?? booking?.hotel_name ?? booking?.hotelName ?? "Hotel unavailable",
    hotelTotal: hotelPrice * nights,
    hotelNightlyRate: hotelPrice,
    flightName: booking?.flight?.airline ?? booking?.airline ?? booking?.flight_name ?? "Flight unavailable",
    flightPrice,
    nights,
    totalAmount,
    date: booking?.date ?? booking?.created_at ?? booking?.travel_date ?? "",
    paymentMethod: booking?.paymentMethod ?? booking?.payment_method ?? booking?.paymentMethodName ?? "",
    paymentStatus: booking?.payment_status ?? booking?.paymentStatus ?? "paid",
    bookingStatus: booking?.booking_status ?? booking?.bookingStatus ?? "confirmed",
    hasHotel: Boolean(booking?.hotel?.name ?? booking?.hotel_name ?? booking?.hotelName),
    hasFlight: Boolean(booking?.flight?.airline ?? booking?.airline ?? booking?.flight_name),
  };
}

function normalizeApiBooking(booking) {
  const nights = Math.max(1, Number(booking?.nights ?? 1));
  const hotelNightlyRate = Number(booking?.hotel_price_per_night ?? booking?.hotel_price ?? 0);
  const hotelTotal = hotelNightlyRate > 0 ? hotelNightlyRate * nights : Number(booking?.hotel_total ?? 0);
  const flightPrice = Number(booking?.flight_price ?? booking?.flight_cost ?? 0);
  const flightName = booking?.airline
    ? [booking.airline, booking.flight_number].filter(Boolean).join(" ")
    : booking?.flight_name || "Flight unavailable";

  return {
    id: booking.id,
    bookingNumber: booking.booking_number,
    destination: booking.destination_name || "Destination unavailable",
    hotelName: booking.hotel_name || "Hotel unavailable",
    hotelTotal,
    hotelNightlyRate,
    flightName,
    flightPrice,
    nights,
    totalAmount: Number(booking.total_amount || 0),
    date: booking.created_at || booking.travel_date,
    paymentMethod: booking.payment_method || "",
    paymentStatus: booking.payment_status || "pending",
    bookingStatus: booking.booking_status || "confirmed",
    hasHotel: Boolean(booking.hotel_name),
    hasFlight: Boolean(booking.airline || booking.flight_name),
  };
}

function tone(status) {
  switch (status) {
    case "confirmed":
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
    case "failed":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function IconShell({ children }) {
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-ocean-500/10 text-ocean-600">
      {children}
    </div>
  );
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V7a2 2 0 0 1 2-2h8v16" />
      <path d="M13 10h6a2 2 0 0 1 2 2v9" />
      <path d="M7 9h2" />
      <path d="M7 13h2" />
      <path d="M7 17h2" />
      <path d="M3 21h18" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14 3 9V6l9 3 9-3v3l-7 5" />
      <path d="M10 14v6l2-1 2 1v-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h3" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V9Z" />
      <path d="M13 7v10" />
      <path d="M13 10h3" />
      <path d="M13 14h3" />
    </svg>
  );
}

function Mytrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      const user = getStoredUser();

      if (!user?.id) {
        const localBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        setBookings(localBookings.map(normalizeStoredBooking));
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/bookings/user/${user.id}`);
        setBookings(response.data.map(normalizeApiBooking));
      } catch {
        try {
          const fallback = JSON.parse(localStorage.getItem("bookings") || "[]");
          setBookings(fallback.map(normalizeStoredBooking));
          if (!fallback.length) {
            setError("Could not load bookings from the backend.");
          }
        } catch {
          setError("Could not load bookings from the backend.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <ErrorState
          title="Login Required"
          message="Please login to view your trips."
          action={<Link to="/login" className="primary-button">Go to Login</Link>}
        />
      </div>
    );
  }

  if (loading) return <LoadingState label="Loading my trips" />;

  if (error && bookings.length === 0) {
    return (
      <ErrorState
        title="My trips unavailable"
        message={error}
        action={<Link to="/booking" className="primary-button">Create a Booking</Link>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Traveler Space"
        title="My Trips"
        description="View all your bookings and travel plans in one place."
        compact
        actions={<Link to="/booking" className="primary-button">Book Another Trip</Link>}
      />

      {error ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error} Showing any trips that were found locally.
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <EmptyState
          title="No Trips Yet"
          message="Your bookings will appear here once you make a reservation."
          action={
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-[28px] bg-slate-100 p-5 text-slate-400">
                <TicketIcon />
              </div>
              <Link to="/booking" className="primary-button">Make My First Booking</Link>
            </div>
          }
        />
      ) : (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_18px_60px_-30px_rgba(15,23,32,0.35)] backdrop-blur"
            >
              <div className="bg-gradient-to-r from-ocean-600 to-[#0f4fb0] px-6 py-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{booking.destination}</h2>
                    <p className="mt-1 text-sm text-blue-100">Booking #{booking.bookingNumber}</p>
                  </div>
                  <div className={`status-badge ${tone(booking.bookingStatus)} border border-white/20 bg-white text-ocean-600`}>
                    {booking.bookingStatus}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {booking.hasHotel ? (
                  <div className="flex items-start gap-3 rounded-[22px] bg-slate-50 p-4">
                    <IconShell>
                      <HotelIcon />
                    </IconShell>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-ink-950">{booking.hotelName}</h3>
                        <span className="text-sm font-semibold text-ink-950">{currency(booking.hotelTotal)}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink-900/60">
                        {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                        {booking.hotelNightlyRate ? ` x ${currency(booking.hotelNightlyRate)}/night` : ""}
                      </p>
                    </div>
                  </div>
                ) : null}

                {booking.hasFlight ? (
                  <div className="flex items-start gap-3 rounded-[22px] bg-slate-50 p-4">
                    <IconShell>
                      <PlaneIcon />
                    </IconShell>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-ink-950">{booking.flightName}</h3>
                        <span className="text-sm font-semibold text-ink-950">{currency(booking.flightPrice)}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink-900/60">Flight details included in this booking</p>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2 border-t border-ink-950/10 pt-4">
                  <div className="flex items-center gap-2 text-sm text-ink-900/60">
                    <CalendarIcon />
                    <span>Booked on {formatBookingDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-900/60">
                    <CreditCardIcon />
                    <span>Paid via {paymentLabel(booking.paymentMethod)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-ink-950/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-ink-900/55">Total Amount Paid</p>
                    <p className="mt-1 text-3xl font-bold text-ocean-600">{currency(booking.totalAmount)}</p>
                  </div>

                  {booking.paymentStatus === "pending" ? (
                    <Link
                      to={`/payment?booking_id=${booking.id}&amount=${booking.totalAmount}&booking_number=${booking.bookingNumber}`}
                      className="primary-button"
                    >
                      Complete Payment
                    </Link>
                  ) : (
                    <span className={`status-badge ${tone(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Mytrips;
