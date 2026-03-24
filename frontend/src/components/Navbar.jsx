import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser, isAdmin, isAuthenticated } from "../lib/auth";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/hotels", label: "Hotels" },
  { to: "/flights", label: "Flights" },
  { to: "/tour-guides", label: "Guides" },
];

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const loggedIn = isAuthenticated();
  const admin = isAdmin();
  const links = loggedIn
    ? [...publicLinks, ...(admin ? [{ to: "/my-trips", label: "My Trips" }, { to: "/admin", label: "Admin" }] : [{ to: "/my-trips", label: "My Trips" }])]
    : publicLinks;

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f8f3ea]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-sm font-bold text-white shadow-lg shadow-ink-950/15">
            TH
          </div>
          <div>
           
            <p className="text-lg font-semibold text-ink-950">TourismHub</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-white text-ink-950 shadow-sm" : "text-ink-900/65 hover:bg-white/70 hover:text-ink-950"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {loggedIn ? (
            <>
              <div className="rounded-full border border-ink-950/10 bg-white/80 px-4 py-2 text-sm">
                <span className="font-semibold text-ink-950">{user?.name || "Traveler"}</span>
                <span className="ml-2 text-ink-900/50">{user?.role || "USER"}</span>
              </div>
              {admin ? (
                <>
                  <Link to="/" className="secondary-button">User Side</Link>
                  <Link to="/admin" className="primary-button">Admin Side</Link>
                </>
              ) : (
                <Link to="/booking" className="primary-button">Book Trip</Link>
              )}
              <button type="button" onClick={handleLogout} className="secondary-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-button">Login</Link>
              <Link to="/signup" className="primary-button">Create Account</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border border-ink-950/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink-950 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-950/8 bg-white/90 px-4 py-4 lg:hidden sm:px-6">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-ink-950 text-white" : "bg-[#f5f2eb] text-ink-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            {loggedIn ? (
              <>
                {admin ? (
                  <>
                    <Link to="/" onClick={() => setOpen(false)} className="secondary-button">
                      User Side
                    </Link>
                    <Link to="/admin" onClick={() => setOpen(false)} className="primary-button">
                      Admin Side
                    </Link>
                  </>
                ) : (
                  <Link to="/booking" onClick={() => setOpen(false)} className="primary-button">
                    Book Trip
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="secondary-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="secondary-button">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="primary-button">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
