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
        return;
      }

      setBusinessName(businessData?.name || "");
      setBusinessType(businessData?.business_type || "");

      const menuTable = `menu_item_${businessData.business_type}`;
      const { data: menuData, error: menuError } = await supabaseClient
        .from(menuTable)
        .select("*")
        .eq("business_id", businessID);

      if (menuError) {
        console.error("Error fetching menu items:", menuError.message);
      } else {
        setMenuItems(menuData || []);
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
          onItemAdded={() => {
            setShowForm(false);
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/3 h-[600px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Menu Items of {businessName}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-2 py-1 rounded shadow"
            >
              <Plus size={14} /> Add
            </button>
          </div>

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
            </div>
          ) : (
            <ul className="space-y-2 p-4 rounded-lg shadow bg-[var(--button)]">
  {menuItems.map((item) => (
    <li
      key={item.item_id}
      className="border-b border-gray-100 pb-2"
    >
      <p className="font-medium text-gray-900">{item.name}</p>
      <p className="text-sm text-gray-600 italic">{item.category}</p>
    </li>
  ))}
</ul>

          )}
        </div>

        {/* Right panel shows form only if showForm is true */}
        <div className="flex-1">{showForm && renderAddForm()}</div>
      </div>
    </div>
  );
}

export default ListBusinessMenu;
