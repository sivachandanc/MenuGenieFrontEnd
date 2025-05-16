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
const sizeOptions = ["Small", "Medium", "Large"];
const dairyOptions = ["Oat Milk", "Almond Milk", "2% Milk", "Whole Milk", "Non-Dairy"];

function AddMenuItemCafeForm({ businessID, onClose, onItemAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "Coffee",
    price: "",
    size_options: [...sizeOptions],
    dairy_options: [...dairyOptions],
    tags: [],
    description: "",
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
  
    // Get the current user's ID
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();
  
    if (sessionError || !session?.user?.id) {
      console.error("User not authenticated");
      return;
    }
  
    const userId = session.user.id;
  
    // Prepare the payload matching menu_item_cafe table
    const payload = {
      user_id: userId,
      business_id: businessID,
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      size_options: form.size_options,
      dairy_options: form.dairy_options,
      tags: form.tags,
      description: form.description,
      available: form.available,
    };
  
    const { error } = await supabaseClient.from("menu_item_cafe").insert([payload]);
    if (error) return console.error("Failed to add item:", error.message);
  
    if (onItemAdded) onItemAdded();
    if (onClose) onClose();
  };
  
  const labelStyle =
    "text-sm font-semibold text-white bg-[var(--label)] px-3 py-1 rounded mb-2 inline-block";

  const inputStyle = (val) =>
    `w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-500 transition ${
      val ? "border-green-500" : "border-gray-300"
    }`;

  const renderOptionButtons = (options, selectedField) =>
    options.map((option) => (
      <button
        type="button"
        key={option}
        onClick={() => handleMultiSelect(selectedField, option)}
        className={`px-3 py-1 rounded-full text-sm border transition ${
          form[selectedField].includes(option)
            ? "bg-blue-100 border-blue-500 text-blue-700"
            : "bg-white border-gray-300 text-gray-600"
        }`}
      >
        {option}
      </button>
    ));

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
        <div>
          <label className={labelStyle}>Item Name</label>
          <input
            type="text"
            placeholder="E.g. Iced Caramel Latte"
            className={inputStyle(form.name)}
            required
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className={labelStyle}>Category</label>
          <select
            className={inputStyle(form.category)}
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {cafeCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelStyle}>Price ($)</label>
          <input
            type="number"
            step="0.01"
            className={inputStyle(form.price)}
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelStyle}>Description</label>
        <textarea
          rows="3"
          placeholder="Describe the item..."
          className={inputStyle(form.description)}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <label className={labelStyle}>Size Options</label>
        <div className="flex flex-wrap gap-2">
          {renderOptionButtons(sizeOptions, "size_options")}
        </div>
      </div>

      <div>
        <label className={labelStyle}>Dairy Options</label>
        <div className="flex flex-wrap gap-2">
          {renderOptionButtons(dairyOptions, "dairy_options")}
        </div>
      </div>

      <div>
        <label className={labelStyle}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {renderOptionButtons(tagOptions, "tags")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className={labelStyle}>Available?</label>
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
