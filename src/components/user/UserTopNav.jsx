import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import menugenie from "../../assets/menu_genie_logo.png";

function UserTopNav() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Close dropdown on click outside
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
    await signOut(); // Supabase logout
    navigate("/"); // Redirect to login
  };

  const MenuGenieLogo = () => {
    return (
      <div className="group h-14 w-14 rounded-full overflow-hidden">
        <img
          src={menugenie}
          alt="MenuGenie Logo"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  };

  return (
    <div
      className="h-14 w-full bg-white shadow flex items-center justify-between px-4 relative"
      ref={dropdownRef}
    >
      <div className="flex flex-row items-center gap-x-3">
        <MenuGenieLogo />
        <h1 className="text-xl font-bold text-gray-800 font-tagees">MenuGenie</h1>
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
