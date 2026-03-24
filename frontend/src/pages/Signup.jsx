import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Create a traveler profile"
        description="The form maps directly to the backend registration route and keeps the frontend simple: name, email, password."
        compact
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="surface-card">
          <span className="section-kicker">Included</span>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-ink-900/68">
            <li>Traveler account creation through the existing auth route.</li>
            <li>Automatic redirect into login after a successful signup.</li>
            <li>Compatible with the `users` table including default role handling.</li>
          </ul>
        </aside>

        <form onSubmit={handleSubmit} className="surface-card space-y-5">
          <div>
            <label className="label-text" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" className="input-shell" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label-text" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input-shell" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="label-text" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input-shell" value={form.password} onChange={handleChange} required />
          </div>

          {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p> : null}

          <button type="submit" disabled={submitting} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Creating account..." : "Signup"}
          </button>

          <p className="text-sm text-ink-900/60">
            Already have an account? <Link to="/login" className="font-semibold text-ocean-600">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Signup;
