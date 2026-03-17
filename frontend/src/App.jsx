import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Campaigns from "./pages/Campaigns";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import TourGuides from "./pages/TourGuides";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tour-guides" element={<TourGuides />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/hotels" element={<Hotels />} />
        {/* Protected Routes */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;