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
  const [showAIUploader, setShowAIUploader] = useState(false);
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
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu List Panel */}
        <div
          className={`${
            showForm || showAIUploader ? "lg:w-2/3" : "w-full"
          } w-full h-[600px] bg-white border border-gray-200 rounded-3xl shadow-lg flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 sticky top-0 z-10 bg-white border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Menu Items of {businessName}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setShowAIUploader(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-xl shadow-sm"
              >
                <Plus size={14} /> Add Item
              </button>
              <button
                onClick={() => {
                  setShowAIUploader((prev) => !prev);
                  setShowForm(false);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition ${
                  showAIUploader
                    ? "bg-[var(--button)] text-white hover:bg-[var(--button-hover)]"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                🧠 Use AI
              </button>
            </div>
          </div>

          {/* Menu List */}
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
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <li
                    key={item.item_id}
                    className="border border-gray-100 p-4 bg-[var(--background)] rounded-2xl shadow hover:shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="mb-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </span>
                      <p className="text-sm text-gray-600 italic">
                        {item.category}
                      </p>
                    </div>

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
                      <div className="mt-2 flex flex-wrap gap-1">
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

        {/* Right Panel Logic */}
        {(showForm || showAIUploader) && (
          <div className="lg:w-1/3 w-full">
            {showForm && renderAddForm()}
            {showAIUploader && (
              <ImageUploader
                businessID={businessID}
                onItemAdded={fetchMenuItems}
                businessType={businessType}
                imageUploaderTitle={
                  "📷 Skip manual entry - Upload your menu image and let AI handle the rest!"
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListBusinessMenu;
