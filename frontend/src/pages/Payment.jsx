import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { currency } from "../lib/format";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    bookingId: "",
    bookingNumber: "",
    amount: "",
    paymentMethod: "esewa",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setForm({
      bookingId: params.get("booking_id") || "",
      bookingNumber: params.get("booking_number") || "",
      amount: params.get("amount") || "",
      paymentMethod: "esewa",
    });
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await API.post("/payments", {
        booking_id: Number(form.bookingId),
        amount: Number(form.amount),
        payment_method: form.paymentMethod,
        payment_status: "paid",
        transaction_id: `TXN-${Date.now()}`,
        payment_date: new Date().toISOString(),
      });

      navigate(`/confirmation?booking_id=${form.bookingId}&amount=${form.amount}&booking_number=${form.bookingNumber}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment could not be recorded.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment"
        title="Record checkout"
        description="This screen records a payment row against the selected booking and sends the traveler into a confirmation state."
        compact
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="surface-card">
          <span className="section-kicker">Invoice</span>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-ink-900/55">Booking ID</p>
              <p className="mt-1 text-xl font-semibold">{form.bookingId || "Pending"}</p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Booking number</p>
              <p className="mt-1 text-xl font-semibold">{form.bookingNumber || "Generated at booking"}</p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Amount due</p>
              <p className="mt-1 text-3xl font-bold text-ocean-600">{currency(form.amount || 0)}</p>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="surface-card space-y-5">
          <div>
            <label className="label-text" htmlFor="bookingId">Booking ID</label>
            <input id="bookingId" value={form.bookingId} readOnly className="input-shell bg-[#f8f8f5]" />
          </div>
          <div>
            <label className="label-text" htmlFor="amount">Amount</label>
            <input id="amount" value={currency(form.amount || 0)} readOnly className="input-shell bg-[#f8f8f5]" />
          </div>
          <div>
            <label className="label-text" htmlFor="paymentMethod">Payment method</label>
            <select
              id="paymentMethod"
              value={form.paymentMethod}
              onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
              className="input-shell"
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p> : null}

          <button type="submit" disabled={!form.bookingId || submitting} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Recording payment..." : "Confirm Payment"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Payment;
