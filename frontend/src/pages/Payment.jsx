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
    paymentMethod: "khalti",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setForm({
      bookingId: params.get("booking_id") || "",
      bookingNumber: params.get("booking_number") || "",
      amount: params.get("amount") || "",
      paymentMethod: "khalti",
    });
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (form.paymentMethod === "khalti") {
        // ── Khalti: initiate and redirect ────────────────────────────────
        const { data } = await API.post("/payments/khalti/initiate", {
          booking_id: Number(form.bookingId),
          booking_number: form.bookingNumber,
          amount: Number(form.amount),
        });

        // Store booking context so KhaltiReturn can finish recording
        sessionStorage.setItem(
          "khalti_pending",
          JSON.stringify({
            booking_id: form.bookingId,
            booking_number: form.bookingNumber,
            amount: form.amount,
          })
        );

        // Redirect browser to Khalti hosted payment page
        window.location.href = data.payment_url;
      } else {
        // ── Other methods: record directly ───────────────────────────────
        await API.post("/payments", {
          booking_id: Number(form.bookingId),
          amount: Number(form.amount),
          payment_method: form.paymentMethod,
          payment_status: "paid",
          transaction_id: `TXN-${Date.now()}`,
          payment_date: new Date().toISOString(),
        });

        navigate(
          `/confirmation?booking_id=${form.bookingId}&amount=${form.amount}&booking_number=${form.bookingNumber}`
        );
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment could not be processed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment"
        title="Secure Checkout"
        description="Complete your payment to confirm the booking."
        compact
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ── Invoice card ── */}
        <aside className="surface-card">
          <span className="section-kicker">Invoice</span>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-ink-900/55">Booking ID</p>
              <p className="mt-1 text-xl font-semibold">{form.bookingId || "Pending"}</p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Booking number</p>
              <p className="mt-1 text-xl font-semibold">
                {form.bookingNumber || "Generated at booking"}
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Amount due</p>
              <p className="mt-1 text-3xl font-bold text-ocean-600">
                {currency(form.amount || 0)}
              </p>
            </div>
          </div>

          {/* Khalti badge */}
          {form.paymentMethod === "khalti" && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-3">
              <span className="text-lg">🔒</span>
              <p className="text-xs text-purple-700">
                You will be redirected to <strong>Khalti</strong> to complete the payment
                securely.
              </p>
            </div>
          )}
        </aside>

        {/* ── Payment form ── */}
        <form onSubmit={handleSubmit} className="surface-card space-y-5">
          <div>
            <label className="label-text" htmlFor="bookingId">
              Booking ID
            </label>
            <input
              id="bookingId"
              value={form.bookingId}
              readOnly
              className="input-shell bg-[#f8f8f5]"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              value={currency(form.amount || 0)}
              readOnly
              className="input-shell bg-[#f8f8f5]"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="paymentMethod">
              Payment method
            </label>
            <select
              id="paymentMethod"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
              }
              className="input-shell"
            >
              <option value="khalti">Khalti</option>
              <option value="esewa">eSewa</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          {message ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!form.bookingId || submitting}
            className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? form.paymentMethod === "khalti"
                ? "Redirecting to Khalti…"
                : "Recording payment…"
              : form.paymentMethod === "khalti"
              ? "Pay with Khalti"
              : "Confirm Payment"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Payment;
