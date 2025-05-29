// EditMenuItemRestaurant.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import toast from "react-hot-toast";

const restaurantCategories = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
];
const tagOptions = [
  "spicy",
  "vegan",
  "gluten-free",
  "chef-special",
  "popular",
  "contains nuts",
  "dairy-free",
];

function EditMenuItemRestaurant({ item, onClose, onItemUpdated }) {
  const [form, setForm] = useState({
    name: item.name || "",
    category: item.category || "Main Course",
    description: item.description || "",
    price: item.price || "",
    cuisine_type: item.cuisine_type || "",
    tags: item.tags || [],
    available: item.available ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showDescEditor, setShowDescEditor] = useState(false);
  const [tempDescription, setTempDescription] = useState(form.description);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleMultiSelect = (field, value) => {
    setForm((prev) => {
      const current = new Set(prev[field]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const context = [
      `name: ${form.name}`,
      `category: ${form.category}`,
      `description: ${form.description}`,
      `price: ${form.price}`,
      `cuisine_type: ${form.cuisine_type}`,
      `tags: ${JSON.stringify(form.tags)}`,
      `available: ${form.available}`,
    ].join("\n");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ context }]),
        }
      );

      if (!response.ok) throw new Error(await response.text());
      const { embeddings } = await response.json();
      if (!Array.isArray(embeddings))
        throw new Error("Invalid embedding response");

      const { error: updateError } = await supabaseClient
        .from("menu_item_restaurant")
        .update({
          name: form.name,
          category: form.category,
          description: form.description,
          price: parseFloat(form.price),
          cuisine_type: form.cuisine_type,
          tags: form.tags,
          available: form.available,
          updated_at: new Date(),
        })
        .eq("item_id", item.item_id);

      const { error: contextError } = await supabaseClient
        .from("menu_context")
        .update({
          context,
          embedding: embeddings[0],
          updated_at: new Date(),
        })
        .eq("item_id", item.item_id);

      if (updateError) throw updateError;
      if (contextError) throw contextError;

      toast.success("Menu item updated successfully!");
      onItemUpdated();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 pt-0 pb-0 shadow-lg space-y-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white pb-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 pt-6">
              Edit {form.name}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button)] focus:ring-[var(--button)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button)] focus:ring-[var(--button)]"
            >
              {restaurantCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              readOnly
              value={form.description}
              onClick={() => {
                setTempDescription(form.description);
                setShowDescEditor(true);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm cursor-pointer bg-gray-50 focus:outline-none"
              rows={2}
              placeholder="Click to edit description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button)] focus:ring-[var(--button)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cuisine Type
            </label>
            <input
              type="text"
              value={form.cuisine_type}
              onChange={(e) => handleChange("cuisine_type", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button)] focus:ring-[var(--button)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleMultiSelect("tags", tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    form.tags.includes(tag)
                      ? "bg-[var(--button-hover)] border-[var(--button)] text-white"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => handleChange("available", e.target.checked)}
              className="h-4 w-4 text-[var(--button)] focus:ring-[var(--button)] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Item is currently available
            </label>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>

        <div className="sticky bottom-0 bg-white pt-4 border-t mt-6">
          <div className="flex justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[var(--button)] hover:bg-[var(--button-hover)] text-white font-semibold rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
      {showDescEditor && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60]"
          onClick={() => setShowDescEditor(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit Description
            </label>
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              rows={8}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowDescEditor(false);
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  handleChange("description", tempDescription);
                  setShowDescEditor(false);
                }
              }}
              className="w-full p-3 border rounded-md focus:ring-[var(--button)] focus:border-[var(--button)]"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDescEditor(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleChange("description", tempDescription);
                  setShowDescEditor(false);
                }}
                className="px-6 py-2 bg-[var(--button)] hover:bg-[var(--button-hover)] text-white font-semibold rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMenuItemRestaurant;
