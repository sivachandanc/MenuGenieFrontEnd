import { useState } from "react";
function EnhancementsStep({ data, onUpdate, onNext, onBack }) {
    const [dietaryNotes, setDietaryNotes] = useState(data.dietaryNotes || "");
    const [topItems, setTopItems] = useState(data.topItems || "");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate({ dietaryNotes, topItems });
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Top-Selling Items</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Butter Chicken, Paneer Tikka"
            value={topItems}
            onChange={(e) => setTopItems(e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Dietary Notes / Allergy Info</label>
          <textarea
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., All dishes are gluten-free and nut-free."
            value={dietaryNotes}
            onChange={(e) => setDietaryNotes(e.target.value)}
          />
        </div>
  
        <div className="flex justify-between">
          <button type="button" onClick={onBack} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            Back
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]">
            Next
          </button>
        </div>
      </form>
    );
  }

export default EnhancementsStep;