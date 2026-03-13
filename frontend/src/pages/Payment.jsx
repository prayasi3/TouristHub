import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Payment() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("esewa");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/payments", {
        booking_id: bookingId,
        amount: amount,
        payment_method: method,
        payment_status: "pending",
        transaction_id: "TEMP-" + Date.now()
      });

      alert("Payment created successfully");
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Make Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="number"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full border p-2"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2"
          required
        />

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-2"
        >
          <option value="esewa">Esewa</option>
          <option value="khalti">Khalti</option>
          <option value="card">Card</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Pay Now
        </button>

      </form>
    </div>
  );
}

export default Payment;