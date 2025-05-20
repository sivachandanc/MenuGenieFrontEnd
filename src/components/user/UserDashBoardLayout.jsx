import Sidebar from "./UserSideBar.jsx";
import UserTopNav from "./UserTopNav.jsx";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidthClass = isDesktop
    ? sidebarExpanded
      ? "w-48"
      : "w-16"
    : "w-0";

  return (
    <div className="flex flex-col h-screen bg-[var(--background)] text-[#1a1a1a]">
      <UserTopNav onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <aside
            className={`transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            <Sidebar isDesktop={true} expanded={sidebarExpanded} />
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Slide-In Sidebar */}
        {!isDesktop && (
          <aside
            className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              isDesktop={false}
              expanded={true}
            />
          </aside>
        )}

        {/* Main Dashboard Content */}
        <main
          className={`flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300 ease-in-out ${
            isDesktop ? (sidebarExpanded ? "ml-48" : "ml-16") : ""
          }`}
        >
          <div className="w-full max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
