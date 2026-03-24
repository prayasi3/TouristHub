import { useEffect, useState } from "react";
import API from "../api/axios";
import { ErrorState, LoadingState } from "../components/StatusView";

const emptyForm = {
  id: null,
  name: "",
  email: "",
  password: "",
  role: "USER",
};

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setError("");
      const [usersResponse, bookingsResponse, paymentsResponse] = await Promise.all([
        API.get("/users"),
        API.get("/bookings"),
        API.get("/payments"),
      ]);
      setUsers(usersResponse.data);
      setBookings(bookingsResponse.data);
      setPayments(paymentsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "USER",
    });
    setMessage("");
  };

  const handleReset = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (form.id) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        };

        if (form.password) {
          payload.password = form.password;
        }

        await API.put(`/users/${form.id}`, payload);
        setMessage("User updated successfully.");
      } else {
        await API.post("/users", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setMessage("User created successfully.");
      }

      handleReset();
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "User operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setMessage("");

    try {
      await API.delete(`/users/${id}`);
      if (form.id === id) {
        handleReset();
      }
      setMessage("User deleted successfully.");
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <LoadingState label="Loading admin dashboard" />;
  if (error) return <ErrorState title="Admin dashboard unavailable" message={error} />;

  const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingPayments = payments.filter((payment) => payment.payment_status === "pending").length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const recentUsers = users.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] bg-[#08111f] px-6 py-8 text-white shadow-[0_30px_100px_-35px_rgba(8,17,31,0.88)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.24),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.02),_transparent)]" />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">
              Admin Control Room
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Platform operations, user permissions, and system visibility.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This dashboard is intentionally separated from the traveler experience. It is built as an operational surface for admins: monitor activity, manage identities, and control roles from one place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Users</p>
                <p className="mt-3 text-3xl font-bold">{users.length}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admins</p>
                <p className="mt-3 text-3xl font-bold">{adminCount}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Bookings</p>
                <p className="mt-3 text-3xl font-bold">{bookings.length}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Revenue Logged</p>
                <p className="mt-3 text-3xl font-bold">NPR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Pending Payments</p>
              <p className="mt-3 text-4xl font-bold">{pendingPayments}</p>
              <p className="mt-2 text-sm text-cyan-50/80">Open transactions that still need follow-up.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recent Accounts</p>
              <div className="mt-4 space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-[#d9e0ea] bg-white p-6 shadow-[0_24px_80px_-38px_rgba(15,23,32,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Identity Editor</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">
                {form.id ? "Update user profile" : "Create a new user"}
              </h2>
            </div>
            {form.id ? (
              <button type="button" onClick={handleReset} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950">
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="label-text" htmlFor="name">Name</label>
              <input id="name" name="name" className="input-shell" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label-text" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input-shell" value={form.email} onChange={handleChange} required />
            </div>
            <div className="grid gap-5 md:grid-cols-[1fr_180px]">
              <div>
                <label className="label-text" htmlFor="password">
                  {form.id ? "Password override" : "Password"}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input-shell"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={form.id ? "Leave blank to keep current password" : ""}
                  required={!form.id}
                />
              </div>
              <div>
                <label className="label-text" htmlFor="role">Role</label>
                <select id="role" name="role" className="input-shell" value={form.role} onChange={handleChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>

          {message ? (
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-[#08111f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d1e37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : form.id ? "Update User" : "Create User"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Reset Form
            </button>
          </div>
        </form>

        <section className="rounded-[32px] border border-[#d9e0ea] bg-white p-6 shadow-[0_24px_80px_-38px_rgba(15,23,32,0.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">User Registry</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">Admin-managed accounts</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {users.length} records
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {users.map((user) => (
              <article key={user.id} className="rounded-[26px] border border-slate-200 bg-[#fbfcfd] p-4 transition hover:border-slate-300 hover:bg-white">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-950">{user.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${user.role === "ADMIN" ? "bg-[#08111f] text-cyan-200" : "bg-slate-100 text-slate-600"}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm text-slate-500">{user.email}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">User ID {user.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(user)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;
