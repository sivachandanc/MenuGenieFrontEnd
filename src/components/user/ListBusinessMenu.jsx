import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { Plus, AlertTriangle } from "lucide-react";
import AddMenuItemCafeForm from "./AddMenuItems/AddMenuItemCafe.jsx";

function BusinessMenu() {
  const { businessID } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchBusinessAndMenu = async () => {
      setLoading(true);

      // Fetch business info
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

      // Fetch menu items
      const { data, error } = await supabaseClient
        .from("menu_context")
        .select("item_id, context")
        .eq("business_id", businessID)
        .eq("type", "menu_type");

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Menu Items {businessName && `on ${businessName}`}
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] text-black px-4 py-2 rounded-md shadow"
          >
            <Plus size={16} /> Add Menu Item
          </button>
        )}
      </div>

      {showForm && renderAddForm()}

      {loading ? (
        <ul className="space-y-4 animate-pulse">
          {Array(4).fill(0).map((_, idx) => (
            <li key={idx} className="h-5 w-full bg-gray-200 rounded"></li>
          ))}
        </ul>
      ) : menuItems.length === 0 ? (
        <div className="text-center text-yellow-700 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>No menu items found.</span>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md"
            >
              + Add First Menu Item
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {menuItems.map((item) => (
            <li key={item.item_id} className="py-3">
              <p className="text-gray-800 font-medium">{item.context}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusinessMenu;