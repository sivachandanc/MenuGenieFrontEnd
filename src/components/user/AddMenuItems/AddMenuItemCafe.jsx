import { useState } from "react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import { X } from "lucide-react";

const cafeCategories = [
  "Coffee",
  "Tea",
  "Iced Beverages",
  "Pastries",
  "Smoothies",
  "Juices",
];

const tagOptions = ["vegan", "gluten-free", "caffeinated", "popular", "seasonal"];

function AddMenuItemCafeForm({ businessID, onClose, onItemAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "Coffee",
    price: "",
    size_options: [],
    add_ons: [],
    tags: [],
    description: "",
    ingredients: "",
    available: true,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      business_id: businessID,
      context: JSON.stringify({ ...form }),
      type: "menu_type",
    };

    const { error } = await supabaseClient.from("menu_context").insert([payload]);
    if (error) return console.error("Failed to add item:", error.message);
    if (onItemAdded) onItemAdded();
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border rounded-lg p-6 shadow space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Add New Menu Item</h2>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item Name"
          className="input"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <select
          className="input"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          {cafeCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Price ($)"
          className="input"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />

        <input
          type="text"
          placeholder="Ingredients (comma-separated)"
          className="input"
          value={form.ingredients}
          onChange={(e) => handleChange("ingredients", e.target.value)}
        />
      </div>

      <textarea
        rows="3"
        placeholder="Description"
        className="input"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {tagOptions.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => handleMultiSelect("tags", tag)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              form.tags.includes(tag) ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-600"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Available?</label>
        <input
          type="checkbox"
          checked={form.available}
          onChange={(e) => handleChange("available", e.target.checked)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-black font-semibold px-4 py-2 rounded shadow"
        >
          Save Item
        </button>
      </div>
    </form>
  );
}

export default AddMenuItemCafeForm;
