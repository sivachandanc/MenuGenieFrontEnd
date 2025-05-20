import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MenuGenieLogo from "../util-components/MenuGenieLogo";

function UserTopNav({ onToggleSidebar }) {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className="sticky top-0 z-50 h-14 w-full bg-[var(--background)] shadow flex items-center justify-between px-4"
      ref={dropdownRef}
    >
      <div className="flex flex-row items-center gap-x-3">
        {/* Hamburger toggle on mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </button>

        <MenuGenieLogo />
        <Link to="/dashboard" className="no-underline">
          <h1 className="text-xl font-bold text-gray-800 font-tagees">
            MenuGenie
          </h1>
        </Link>
      </div>

      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--button)] focus:outline-none"
      >
        <img
          src="https://api.dicebear.com/7.x/lorelei/svg?seed=User"
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-14 right-4 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserTopNav;
