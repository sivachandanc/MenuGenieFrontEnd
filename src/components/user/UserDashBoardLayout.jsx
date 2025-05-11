import Sidebar from "./UserSideBar";
import UserTopNav from "./UserTopNav";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <UserTopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
