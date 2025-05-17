import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { Plus, AlertTriangle, CheckCircle } from "lucide-react";
import AddMenuItemCafeForm from "./AddMenuItems/AddMenuItemCafe.jsx";
import ImageUploader from "./AddMenuItems/ImageUploader.jsx";

function ListBusinessMenu() {
  const { businessID } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchMenuItems = async () => {
    setLoading(true);
    const menuTable = `menu_item_${businessType}`;
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
    };

    fetchBusinessAndMenu();
  }, [businessID]);

  useEffect(() => {
    if (businessType) fetchMenuItems();
  }, [businessType]);

  const renderAddForm = () => {
    if (businessType === "cafe") {
      return (
        <AddMenuItemCafeForm
          businessID={businessID}
          onClose={() => setShowForm(false)}
          onItemAdded={() => {
            setShowForm(false);
            setShowSuccess(true);
            fetchMenuItems();
            setTimeout(() => setShowSuccess(false), 2000);
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
        <div className="w-2/3 h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <div className="p-4 sticky top-0 z-10 bg-white border-b border-gray-100 flex justify-between items-center">
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

          {/* Scrollable content */}
          <div className="p-4 overflow-y-auto flex-1 relative">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm mb-3 bg-green-50 border border-green-200 px-3 py-2 rounded-md animate-pulse">
                <CheckCircle className="w-4 h-4" /> Menu item added
                successfully!
              </div>
            )}

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
              <ul className="relative space-y-3 p-1 overflow-visible">
                {menuItems.map((item) => (
                  <li
                    key={item.item_id}
                    className="relative border border-gray-100 p-4 bg-[var(--background)] rounded-2xl shadow-sm transition duration-200 hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="relative group inline-block w-fit">
                      <span className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </span>
                      <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[var(--button)] transition-all duration-300 group-hover:w-full"></span>
                    </div>

                    <p className="text-sm text-gray-600 italic mb-1">
                      {item.category}
                    </p>

                    {Array.isArray(item.size_options) && (
                      <p className="text-sm text-gray-700">
                        {item.size_options
                          .map(
                            (s) =>
                              `${s.size || "?"} ($${parseFloat(s.price).toFixed(
                                2
                              )})`
                          )
                          .join(" · ")}
                      </p>
                    )}

                    {item.tags?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {!showForm && (
          <div className="w-1/3">
            <ImageUploader
              businessID={businessID}
              imageUploaderTitle={
                "📷 Skip manual entry - Upload your menu image and let AI handle the rest!"
              }
            />
          </div>
        )}

        {/* Right panel shows form only if showForm is true */}
        <div className="flex-1">{showForm && renderAddForm()}</div>
      </div>
    </div>
  );
}

export default ListBusinessMenu;
