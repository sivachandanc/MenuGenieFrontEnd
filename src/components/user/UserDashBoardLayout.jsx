import Sidebar from "./UserSideBar.jsx";
import UserTopNav from "./UserTopNav.jsx";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function UserDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[var(--background)] text-[#1a1a1a]">
      {/* Top Navbar with toggle */}
      <UserTopNav onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Slide-In Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* ✅ Pass the onClose prop here */}
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
