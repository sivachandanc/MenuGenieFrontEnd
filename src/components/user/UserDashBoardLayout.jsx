import Sidebar from "./UserSideBar.jsx";
import UserTopNav from "./UserTopNav.jsx";
import UserDashBoard from "./UserDashBoard.jsx"

export default function UserDashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#f5f7fa] text-[#1a1a1a]">
      {/* Top Navbar */}
      <UserTopNav />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
            <UserDashBoard/>
        </main>
      </div>
    </div>
  );
}
