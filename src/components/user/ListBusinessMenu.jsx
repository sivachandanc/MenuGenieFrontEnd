import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Bot,
  Utensils,
  CircleArrowLeft,
  Pencil,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";

import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { DeleteMenuItem } from "../../supabase-utils/delete-menu-item/DeleteMenuItem.jsx";
import AddMenuItemCafeForm from "./AddMenuItems/AddMenuItemCafe.jsx";
import ImageUploader from "./AddMenuItems/ImageUploader.jsx";
import EditMenuItemCafeForm from "./EditMenuItems/EditCafeMenuItem.jsx";

function ListBusinessMenu() {
  const { businessID } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("menu");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteMenuItems, setSelecteMenuItems] = useState([]);

  const [bulkDelete, setBulkDelete] = useState(false);

  const confirmBulkDelete = () => {
    setBulkDelete(true);
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const menuTable = `menu_item_${businessType}`;
      let failedCount = 0;

      for (const itemId of selecteMenuItems) {
        try {
          await DeleteMenuItem(menuTable, itemId);
        } catch (err) {
          console.error(`Failed to delete item ${itemId}:`, err.message);
          failedCount++;
        }
      }

      if (failedCount === 0) {
        toast.success("All selected items deleted");
      } else {
        toast.error(`${failedCount} item(s) failed to delete`);
      }

      setSelecteMenuItems([]);
      fetchMenuItems();
    } catch (err) {
      console.error("Bulk delete failed:", err.message);
      toast.error("Bulk deletion failed");
    } finally {
      setShowDeleteConfirm(false);
      setBulkDelete(false);
      setDeleting(false);
    }
  };

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
    setDeleting(true);
    try {
      const menuTable = `menu_item_${businessType}`;
      await DeleteMenuItem(menuTable, itemToDelete.item_id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      fetchMenuItems();
      toast.success("Menu item deleted");
    } catch (error) {
      console.error("Delete failed:", error.message);
      toast.error("Failed to delete item: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 h-[calc(100vh-2rem)] flex flex-col gap-4">
      <div className="flex-1 overflow-hidden">
        <div className="sticky top-0 z-40 pt-2 pb-3">
          <div className="flex flex-row space-x-2 items-center">
            <button
              onClick={() => navigate(`/dashboard/business/${businessID}`)}
              className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition shadow"
            >
              <div className="flex flex-row space-x-1 items-center">
                <CircleArrowLeft size={20} />
              </div>
            </button>

            <div className="flex flex-wrap justify-center bg-[var(--tabs-color)] p-1 rounded-md w-fit ml-auto mr-auto">
              {[
                { id: "menu", label: "Menu", icon: <Utensils size={14} /> },
                { id: "add", label: "Add Item", icon: <Plus size={14} /> },
                { id: "ai", label: "Use AI", icon: <Bot size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center justify-center gap-1 px-4 py-2 rounded-md text-sm font-semibold transition min-w-[80px] text-center ${
                    selectedTab === tab.id
                      ? "bg-[var(--button)] text-white"
                      : "text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="max-h-[75vh]
 overflow-y-auto p-0 bg-white border border-gray-200 rounded-2xl shadow"
        >
          {selectedTab === "menu" && (
            <>
              <div className="sticky top-0 bg-white z-20 pb-2">
                <h2 className="text-lg font-semibold text-gray-800 p-2">
                  Menu Items of{" "}
                  <span className="text-[var(--button)]">{businessName}</span>
                </h2>
              </div>

              {selecteMenuItems.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-2 rounded mb-2 flex justify-between items-center text-sm">
                  <span>{selecteMenuItems.length} item(s) selected</span>
                  <button
                    onClick={confirmBulkDelete}
                    disabled={deleting}
                    className={`text-red-600 font-semibold ${
                      deleting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:underline"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Delete Selected"}
                  </button>
                </div>
              )}

              {loading ? (
                <ul className="space-y-3 animate-pulse">
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <li
                        key={idx}
                        className="h-4 w-full bg-gray-200 rounded"
                      />
                    ))}
                </ul>
              ) : menuItems.length === 0 ? (
                <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-md p-2">
                  <div className="flex justify-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>No menu items found.</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-2 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selecteMenuItems.length === menuItems.length &&
                              menuItems.length > 0
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelecteMenuItems(
                                  menuItems.map((item) => item.item_id)
                                );
                              } else {
                                setSelecteMenuItems([]);
                              }
                            }}
                          />
                        </th>
                        <th className="px-4 py-2 text-left">Menu Item</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {menuItems.map((item) => (
                        <tr key={item.item_id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selecteMenuItems.includes(item.item_id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelecteMenuItems((prev) => [
                                    ...prev,
                                    item.item_id,
                                  ]);
                                } else {
                                  setSelecteMenuItems((prev) =>
                                    prev.filter((id) => id !== item.item_id)
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-600 italic">
                              {Array.isArray(item.size_options)
                                ? item.size_options
                                    .map(
                                      (s) =>
                                        `${s.size || "?"} ($${parseFloat(
                                          s.price
                                        ).toFixed(2)})`
                                    )
                                    .join(" · ")
                                : ""}
                            </div>
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
                          </td>
                          <td className="px-4 py-2">{item.category}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-center gap-3">
                              <button
                                className="text-gray-500 hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingItem(item);
                                }}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="text-gray-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setItemToDelete(item);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {selectedTab === "add" && businessType === "cafe" && (
            <AddMenuItemCafeForm
              businessID={businessID}
              onClose={() => {}}
              onItemAdded={() => {
                toast.success("Item added successfully!");
                fetchMenuItems();
                setSelectedTab("menu");
              }}
            />
          )}

          {selectedTab === "ai" && (
            <ImageUploader
              businessID={businessID}
              onItemAdded={fetchMenuItems}
              businessType={businessType}
              imageUploaderTitle="📷 Skip manual entry - Upload your menu image and let AI handle the rest!"
            />
          )}
        </div>
      </div>

      {editingItem && (
        <EditMenuItemCafeForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onItemUpdated={() => {
            setEditingItem(null);
            fetchMenuItems();
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {bulkDelete
                ? `Are you sure you want to delete ${selecteMenuItems.length} item(s)?`
                : `Are you sure you want to delete "${itemToDelete?.name}"?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBulkDelete(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-1 text-sm text-gray-700 hover:underline"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={bulkDelete ? handleBulkDelete : handleDeleteItem}
                disabled={deleting}
                className="px-4 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
              >
                {deleting ? (
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListBusinessMenu;
