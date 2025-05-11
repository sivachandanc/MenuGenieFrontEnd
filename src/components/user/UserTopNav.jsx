import { useState, useRef, useEffect } from "react";

function UserTopNav() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-14 w-full bg-white shadow flex items-center justify-between px-4 relative" ref={dropdownRef}>
      <h1 className="text-xl font-bold text-gray-800">MenuGenie</h1>

      {/* Avatar Button */}
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

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-14 right-4 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Settings
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100">
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

export default UserTopNav;
