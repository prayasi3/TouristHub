import { useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const bookingId = params.get("booking_id");
  const amount = params.get("amount");

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Booking Successful 🎉
      </h1>

      <p className="mt-4 text-lg">
        Booking ID: <strong>{bookingId}</strong>
      </p>

      <p className="text-lg">
        Total Paid: <strong>${amount}</strong>
      </p>
    </div>
  );
}

export default Confirmation;