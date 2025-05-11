import Sidebar from "./UserSideBar";
import UserTopNav from "./UserTopNav";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-[#f5f7fa] text-[#1a1a1a]">
      {/* Top Navbar */}
      <UserTopNav />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
