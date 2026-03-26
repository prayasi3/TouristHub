import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  FAILED: "failed",
};

function KhaltiReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [errorMsg, setErrorMsg] = useState("");
  const verified = useRef(false); // guard against double-invocation in StrictMode

  useEffect(() => {
    if (verified.current) return;
    verified.current = true;

    const params = new URLSearchParams(location.search);
    const pidx = params.get("pidx");
    const txnStatus = params.get("status"); // "Completed" | "Pending" | "User canceled"

    // Pull stored booking context
    let pending = {};
    try {
      pending = JSON.parse(sessionStorage.getItem("khalti_pending") || "{}");
    } catch (_) {}

    const { booking_id, booking_number, amount } = pending;

    // If Khalti already tells us it was cancelled, short-circuit
    if (txnStatus && txnStatus.toLowerCase() !== "completed") {
      setStatus(STATUS.FAILED);
      setErrorMsg(`Payment was not completed. Khalti status: "${txnStatus}".`);
      return;
    }

    if (!pidx) {
      setStatus(STATUS.FAILED);
      setErrorMsg("No payment reference (pidx) received from Khalti.");
      return;
    }

    // Verify with backend
    API.post("/payments/khalti/verify", {
      pidx,
      booking_id: Number(booking_id),
      booking_number,
      amount: Number(amount),
    })
      .then(() => {
        sessionStorage.removeItem("khalti_pending");
        setStatus(STATUS.SUCCESS);
        setTimeout(() => {
          navigate(
            `/confirmation?booking_id=${booking_id}&amount=${amount}&booking_number=${booking_number}`
          );
        }, 1500);
      })
      .catch((err) => {
        setStatus(STATUS.FAILED);
        setErrorMsg(
          err.response?.data?.message || "Payment verification failed. Please contact support."
        );
      });
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface-card max-w-md w-full text-center space-y-6">
        {status === STATUS.VERIFYING && (
          <>
            {/* Spinner */}
            <div className="mx-auto h-14 w-14 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
            <h2 className="text-xl font-semibold">Verifying your payment…</h2>
            <p className="text-sm text-ink-900/55">
              Please wait while we confirm your Khalti transaction.
            </p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-green-700">Payment Confirmed!</h2>
            <p className="text-sm text-ink-900/55">Redirecting you to your confirmation…</p>
          </>
        )}

        {status === STATUS.FAILED && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Payment Failed</h2>
            <p className="text-sm text-red-600">{errorMsg}</p>
            <button
              onClick={() => navigate(-1)}
              className="primary-button w-full"
            >
              Go back and try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default KhaltiReturn;
