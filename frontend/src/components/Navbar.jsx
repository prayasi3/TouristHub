import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">TourismHub</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/destinations" className="hover:text-blue-600">Destinations</Link>
        <Link to="/campaigns" className="hover:text-blue-600">Campaigns</Link>
        <Link to="/tour-guides" className="hover:text-blue-600">Tour Guides</Link>

        {token ? (
          <>
            <Link
              to="/booking"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Booking
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;