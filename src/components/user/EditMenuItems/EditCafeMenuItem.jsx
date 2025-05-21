import { useState } from "react";
import { X } from "lucide-react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";

const cafeCategories = [
  "Coffee",
  "Tea",
  "Iced Beverages",
  "Pastries",
  "Smoothies",
  "Juices",
];

const tagOptions = [
  "vegan",
  "gluten-free",
  "caffeinated",
  "popular",
  "seasonal",
];
const dairyOptions = [
  "Oat Milk",
  "Almond Milk",
  "2% Milk",
  "Whole Milk",
  "Non-Dairy",
];
const formOptions = ["Hot", "Cold", "Frozen"];

function EditMenuItemCafeForm({ item, onClose, onItemUpdated }) {
  const [form, setForm] = useState({
    name: item.name || "",
    category: item.category || "Coffee",
    description: item.description || "",
    size_price_pairs: item.size_options || [
      { size: "Small", price: "" },
      { size: "Medium", price: "" },
      { size: "Large", price: "" },
    ],
    dairy_options: item.dairy_options || [],
    tags: item.tags || [],
    form_options: item.form_options || [],
    available: item.available ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    setForm((prev) => {
      const current = new Set(prev[field]);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleSizeChange = (index, key, value) => {
    const updated = [...form.size_price_pairs];
    updated[index][key] = value;
    setForm({ ...form, size_price_pairs: updated });
  };

  const addSizePrice = () => {
    setForm((prev) => ({
      ...prev,
      size_price_pairs: [...prev.size_price_pairs, { size: "", price: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from("menu_item_cafe")
        .update({
          name: form.name,
          category: form.category,
          description: form.description,
          size_options: form.size_price_pairs,
          dairy_options: form.dairy_options,
          tags: form.tags,
          form_options: form.form_options,
          available: form.available,
          updated_at: new Date(),
        })
        .eq("id", item.id);

      if (error) throw error;
      onItemUpdated();
    } catch (err) {
      setError(err.message);
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
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {cafeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Size and Price Pairs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes and Prices
            </label>
            {form.size_price_pairs.map((pair, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pair.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                  placeholder="Size"
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={pair.price}
                  onChange={(e) =>
                    handleSizeChange(index, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addSizePrice}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Size Option
            </button>
          </div>

          {/* Dairy Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dairy Options
            </label>
            <div className="flex flex-wrap gap-2">
              {dairyOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleMultiSelect("dairy_options", option)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    form.dairy_options.includes(option)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
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
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Form Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Options
            </label>
            <div className="flex flex-wrap gap-2">
              {formOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleMultiSelect("form_options", option)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    form.form_options.includes(option)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => handleChange("available", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditMenuItemCafeForm;
