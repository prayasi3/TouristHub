import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { saveSession } from "../lib/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await API.post("/auth/login", { email, password });
      saveSession(response.data.user, response.data.token || "");
      navigate(location.state?.from || (response.data.user?.role === "ADMIN" ? "/admin" : "/my-trips"));
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Log in to continue booking"
        description="Login now stores both the returned user profile and JWT so role-based navigation, admin access, and protected screens work consistently."
        compact
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="surface-card">
          <span className="section-kicker">Why sign in</span>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-ink-900/68">
            <li>Track your booking history from the my-trips area.</li>
            <li>Move directly from booking to payment without losing context.</li>
            <li>Keep traveler identity attached to reservations.</li>
          </ul>
        </aside>

        <form onSubmit={handleSubmit} className="surface-card space-y-5">
          <div>
            <label className="label-text" htmlFor="email">Email</label>
            <input id="email" type="email" className="input-shell" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="label-text" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input-shell pr-14"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-ink-900/55 transition hover:bg-[#f3f4ef] hover:text-ink-950"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p> : null}

          <button type="submit" disabled={submitting} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm text-ink-900/60">
            Need an account? <Link to="/signup" className="font-semibold text-ocean-600">Create one</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
