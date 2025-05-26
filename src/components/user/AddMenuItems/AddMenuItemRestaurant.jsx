// AddMenuItemRestaurant.jsx
import { useState } from "react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const restaurantCategories = ["Appetizer", "Main Course", "Dessert", "Beverage"];
const tagOptions = ["spicy", "vegan", "gluten-free", "chef-special", "popular", "contains nuts", "dairy-free"];

function AddMenuItemRestaurant({ businessID, onClose, onItemAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "Main Course",
    description: "",
    price: "",
    cuisine_type: "",
    tags: [],
    available: true,
  });

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
    const loadingToastId = toast.loading("🔄 Generating item embedding...");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabaseClient.auth.getSession();

      if (sessionError || !session?.user?.id) {
        toast.error("❌ User not authenticated", { id: loadingToastId });
        return;
      }

      const userId = session.user.id;
      const context = [
        `name: ${form.name}`,
        `category: ${form.category}`,
        `description: ${form.description}`,
        `price: ${form.price}`,
        `cuisine_type: ${form.cuisine_type}`,
        `tags: ${JSON.stringify(form.tags)}`,
        `available: ${form.available}`,
      ].join("\n");

      const embeddingRes = await fetch(`${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ context }]),
      });

      if (!embeddingRes.ok) throw new Error(await embeddingRes.text());
      const { embeddings } = await embeddingRes.json();
      if (!Array.isArray(embeddings) || !embeddings.length) throw new Error("Invalid embeddings");

      const { data: inserted, error: insertError } = await supabaseClient
        .from("menu_item_restaurant")
        .insert([
          { ...form, user_id: userId, business_id: businessID, price: parseFloat(form.price) },
        ])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      const contextPayload = {
        user_id: userId,
        business_id: businessID,
        item_id: inserted.item_id,
        context,
        type: "menu_item",
        embedding: embeddings[0],
      };

      await supabaseClient.from("menu_context").insert([contextPayload]);
      toast.success(`"${form.name}" added to menu`, { id: loadingToastId });
      onItemAdded?.();
      onClose?.();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error(`❌ ${err.message || "Something went wrong"}`, { id: loadingToastId });
    }
  };

  const labelStyle = "text-sm font-semibold text-white bg-[var(--label)] px-3 py-1 rounded mb-2 inline-block";
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-4 overflow-auto max-h-[75vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Add Restaurant Menu Item</h2>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Item Name</label>
          <input
            type="text"
            placeholder="E.g. Butter Chicken"
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
            {restaurantCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Price ($)</label>
          <input
            type="number"
            className={inputStyle(form.price)}
            required
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        <div>
          <label className={labelStyle}>Cuisine Type</label>
          <input
            type="text"
            placeholder="E.g. Indian"
            className={inputStyle(form.cuisine_type)}
            value={form.cuisine_type}
            onChange={(e) => handleChange("cuisine_type", e.target.value)}
          />
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

export default AddMenuItemRestaurant;
