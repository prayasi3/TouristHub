import { Link, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { currency } from "../lib/format";

function Confirmation() {
  const params = new URLSearchParams(useLocation().search);
  const bookingId = params.get("booking_id");
  const bookingNumber = params.get("booking_number");
  const amount = params.get("amount");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Confirmed"
        title="Payment recorded successfully"
        description="The payment row has been submitted. From here the traveler can return to the dashboard and review the booking lifecycle."
        compact
        actions={
          <>
            <Link to="/my-trips" className="primary-button">Open My Trips</Link>
            <Link to="/booking" className="secondary-button">Book Another Trip</Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Booking ID</p>
          <p className="mt-3 text-3xl font-bold">{bookingId || "N/A"}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Booking number</p>
          <p className="mt-3 text-xl font-bold">{bookingNumber || "N/A"}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-ink-900/55">Amount paid</p>
          <p className="mt-3 text-3xl font-bold">{currency(amount || 0)}</p>
        </div>
      </section>
    </div>
  );
}

export default Confirmation;
