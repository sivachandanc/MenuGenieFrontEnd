import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Bot,
  Utensils,
  Pencil,
  Trash,
} from "lucide-react";

import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { DeleteMenuItem } from "../../supabase-utils/delete-menu-item/DeleteMenuItem.jsx";
import AddMenuItemCafeForm from "./AddMenuItems/AddMenuItemCafe.jsx";
import ImageUploader from "./AddMenuItems/ImageUploader.jsx";

function ListBusinessMenu() {
  const { businessID } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAIUploader, setShowAIUploader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    const menuTable = `menu_item_${businessType}`;
    const { data, error } = await supabaseClient
      .from(menuTable)
      .select("*")
      .eq("business_id", businessID);
    if (!error) setMenuItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabaseClient
        .from("business")
        .select("name, business_type")
        .eq("business_id", businessID)
        .single();

      if (!error) {
        setBusinessName(data?.name || "");
        setBusinessType(data?.business_type || "");
      }
    };

    fetchBusiness();
  }, [businessID]);

  useEffect(() => {
    if (businessType) fetchMenuItems();
  }, [businessType]);

  const handleDeleteItem = async () => {
    try {
      const menuTable = `menu_item_${businessType}`;
      await DeleteMenuItem(menuTable, itemToDelete.item_id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      fetchMenuItems();
    } catch (error) {
      console.error("Delete failed:", error.message);
      alert(`Failed to delete item: ${error.message}`);
    }
  };

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
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        {(showForm || showAIUploader) && (
          <div className="lg:w-1/3 w-full">
            {showForm && renderAddForm()}
            {showAIUploader && (
              <ImageUploader
                businessID={businessID}
                onItemAdded={fetchMenuItems}
                businessType={businessType}
                imageUploaderTitle="📷 Skip manual entry - Upload your menu image and let AI handle the rest!"
              />
            )}
          </div>
        )}

        <div
          className={`w-full ${
            showForm || showAIUploader ? "lg:w-2/3" : ""
          } min-h-[400px] max-h-screen bg-white border border-gray-200 rounded-3xl shadow-lg flex flex-col overflow-hidden`}
        >
          <div className="p-4 sticky top-0 z-10 bg-white border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center flex-wrap">
              <span className="pl-5">Menu Items of</span>
              <span className="ml-2 relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[var(--label)]">
                <span className="relative text-white dark:text-gray-950">
                  {businessName}
                </span>
              </span>
            </h2>

            <div className="mt-2 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-2">
              <button
                onClick={() => navigate(`/dashboard/business/${businessID}`)}
                className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition shadow"
              >
                <div className="flex flex-row space-x-1 items-center">
                  <Utensils size={20} />
                  <span>View Business</span>
                </div>
              </button>

              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <button
                  onClick={() => {
                    setShowForm((prev) => !prev);
                    setShowAIUploader(false);
                  }}
                  className={`flex px-5 py-2 rounded-full items-center gap-1 text-sm font-semibold shadow-sm transition ${
                    showForm
                      ? "bg-[var(--button)] text-white hover:bg-[var(--button-hover)]"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <Plus size={14} /> Add Item
                </button>

                <button
                  onClick={() => {
                    setShowAIUploader((prev) => !prev);
                    setShowForm(false);
                  }}
                  className={`flex px-5 py-2 rounded-full items-center gap-1 text-sm font-semibold shadow-sm transition ${
                    showAIUploader
                      ? "bg-[var(--button)] text-white hover:bg-[var(--button-hover)]"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <Bot size={14} /> Use AI
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1 relative">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm mb-3 bg-green-50 border border-green-200 px-3 py-2 rounded-md animate-pulse">
                <CheckCircle className="w-4 h-4" /> Menu item added successfully!
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
                    className="relative border border-gray-100 p-4 bg-[var(--background)] rounded-2xl shadow hover:shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button className="text-gray-500 hover:text-blue-600 transition">
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(item);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    <div className="mb-1 pr-6">
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
      </div>

      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{itemToDelete.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-1 text-sm text-gray-700 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListBusinessMenu;
