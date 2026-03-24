import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../lib/auth";

const adminLinks = [
  { to: "/admin", label: "Overview" },
];

function AdminLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#08111f] px-5 py-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-black text-cyan-200">
              AD
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Admin Space</p>
              <p className="text-lg font-semibold text-white">TourismHub</p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in as</p>
            <p className="mt-2 text-base font-semibold text-white">{user?.name || "Admin"}</p>
            <p className="mt-1 text-sm text-slate-400">{user?.email || ""}</p>
            <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              {user?.role || "ADMIN"}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-400/15 text-cyan-200"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Open User Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
