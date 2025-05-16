import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { Plus, AlertTriangle } from "lucide-react";
import AddMenuItemCafeForm from "./AddMenuItems/AddMenuItemCafe.jsx";

function ListBusinessMenu() {
  const { businessID } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchBusinessAndMenu = async () => {
      setLoading(true);

      const { data: businessData, error: businessError } = await supabaseClient
        .from("business")
        .select("name, business_type")
        .eq("business_id", businessID)
        .single();

      if (businessError) {
        console.error("Error fetching business info:", businessError.message);
      } else {
        setBusinessName(businessData?.name || "");
        setBusinessType(businessData?.business_type || "");
      }
      const menuTable = `menu_item_${businessData.business_type}`;
      const { data, error } = await supabaseClient
        .from(menuTable)
        .select("*")
        .eq("business_id", businessID)

      if (error) {
        console.error("Error fetching menu items:", error.message);
      } else {
        setMenuItems(data || []);
      }

      setLoading(false);
    };

    fetchBusinessAndMenu();
  }, [businessID]);

  const renderAddForm = () => {
    if (businessType === "cafe") {
      return (
        <AddMenuItemCafeForm
          businessID={businessID}
          onClose={() => setShowForm(false)}
          onItemAdded={() => setShowForm(false)}
        />
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-6">
        {/* Sidebar with scrollable menu items */}
        <div className="w-1/3 max-h-[600px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Menu Items</h2>

          {loading ? (
            <ul className="space-y-3 animate-pulse">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <li key={idx} className="h-4 w-full bg-gray-200 rounded" />
                ))}
            </ul>
          ) : menuItems.length === 0 ? (
            <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>No menu items found.</span>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 w-full text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded transition"
                >
                  + Add First Menu Item
                </button>
              )}
            </div>
          ) : (
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li
                  key={item.item_id}
                  className="text-gray-800 text-sm border-b border-gray-100 pb-2"
                >
                  {item.context}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Menu Items {businessName && `on ${businessName}`}
            </h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
              >
                <Plus size={16} /> Add Menu Item
              </button>
            )}
          </div>

          {showForm && renderAddForm()}
        </div>
      </div>
    </div>
  );
}

export default ListBusinessMenu;
