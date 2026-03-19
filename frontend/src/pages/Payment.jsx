import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("esewa");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setBookingId(params.get("booking_id") || "");
    setAmount(params.get("amount") || "");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/payments", {
        booking_id: bookingId,
        amount: amount,
        payment_method: method,
        payment_status: "pending",
        transaction_id: "TEMP-" + Date.now()
      });

      // ✅ Payment successful message
      alert("Payment successful!");

      navigate(`/confirmation?booking_id=${bookingId}&amount=${amount}`);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={bookingId} readOnly className="w-full border p-2" />
        <input value={amount} readOnly className="w-full border p-2" />

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-2"
        >
          <option value="esewa">Esewa</option>
          <option value="khalti">Khalti</option>
        </select>

        <button className="w-full bg-green-500 text-white p-2 rounded">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;