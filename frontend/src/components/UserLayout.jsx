import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function UserLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
