import Sidebar from "./UserSideBar.jsx";
import UserTopNav from "./UserTopNav.jsx";
import { Outlet } from "react-router-dom"; 
import MiddlewareTest from "../tests/MiddleWareTest.jsx";

export default function UserDashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-[var(--background)] text-[#1a1a1a]">
      {/* Top Navbar */}
      <UserTopNav />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto bg-[var(--background)]">
        <Outlet />
        <MiddlewareTest/>
        </main>
      </div>
    </div>
  );
}
