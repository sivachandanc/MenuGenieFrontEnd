import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, Plus, X } from "lucide-react";

const navItems = [
  { icon: <Utensils />, label: "My Businesses", path: "/dashboard" },
  { icon: <Plus />, label: "Add Business", path: "/dashboard/onboarding" },
];

function Sidebar({ onClose }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      onMouseEnter={() => isDesktop && setExpanded(true)}
      onMouseLeave={() => isDesktop && setExpanded(false)}
      className={`h-full transition-all duration-200 bg-[var(--background)] shadow border-r border-gray-200 flex flex-col
        ${isDesktop ? (expanded ? "w-48" : "w-16") : "w-full"}`}
    >
      {/* Close button for mobile */}
      {!isDesktop && (
        <div className="flex justify-end p-3">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4 mt-4">
        {navItems.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              navigate(item.path);
              if (onClose) onClose(); // close sidebar on mobile
            }}
            className="flex items-center space-x-2 px-4 py-2 w-full hover:bg-[var(--button-hover)] cursor-pointer border-1 rounded-full"
          >
            <div className="text-gray-600">{item.icon}</div>
            {(expanded || !isDesktop) && (
              <span className="text-sm text-gray-800">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
