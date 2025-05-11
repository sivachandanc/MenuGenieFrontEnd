import { useState } from "react";
import {
  Home,
  Database,
  Settings,
  Users,
  BarChart,
  Utensils,
} from "lucide-react";

const navItems = [
  { icon: <Utensils />, label: "My Businesses" },
//   { icon: <Database />, label: "Database" },
//   { icon: <Users />, label: "Users" },
//   { icon: <BarChart />, label: "Analytics" },
//   { icon: <Settings />, label: "Settings" },
];

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`transition-all duration-300 bg-[var(--background)] shadow h-full ${
        expanded ? "w-48" : "w-16"
      }`}
    >
      <div className="flex flex-col items-center space-y-4 mt-4">
        {navItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center space-x-2 px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
          >
            <div className="text-gray-600">{item.icon}</div>
            {expanded && <span className="text-sm text-gray-800">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


export default Sidebar;