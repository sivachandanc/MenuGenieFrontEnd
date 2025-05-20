import { useState } from "react";

function EnhancementsStep({ data, onUpdate, onNext, onBack }) {
  const [topItems, setTopItems] = useState(data.topItems || "");
  const [ownershipTags, setOwnershipTags] = useState(data.ownershipTags || []);
  const businessType = data.business_type || "";

  const ownershipOptions = [
    { label: "Veteran Owned", emoji: "🎖️" },
    { label: "Female Owned", emoji: "👩‍💼" },
    { label: "LGBTQ Owned", emoji: "🏳️‍🌈" },
    { label: "Black Owned", emoji: "✊🏿" },
    { label: "First Responder Owned", emoji: "🚒" },
  ];

  const getPlaceholder = () => {
    switch (businessType) {
      case "cafe":
        return "e.g., Cappuccino, Blueberry Muffin";
      case "restaurant":
        return "e.g., Butter Chicken, Paneer Tikka";
      case "food_truck":
        return "e.g., Tacos, Loaded Fries";
      case "bakery":
        return "e.g., Croissants, Custom Cakes";
      default:
        return "e.g., Signature dishes or top-sellers";
    }
  };

  const toggleTag = (tag) => {
    if (ownershipTags.includes(tag)) {
      setOwnershipTags(ownershipTags.filter((t) => t !== tag));
    } else {
      setOwnershipTags([...ownershipTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ topItems, ownershipTags });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto" noValidate>
      <h2 className="text-xl font-bold text-black font-inter">Business Enhancements</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top-Selling Items
          </label>
          <input
            type="text"
            placeholder={getPlaceholder()}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={topItems}
            onChange={(e) => setTopItems(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ownership Tags (optional)
          </label>
          <div className="flex flex-wrap gap-3">
            {ownershipOptions.map(({ label, emoji }) => {
              const isSelected = ownershipTags.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleTag(label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition 
                    ${
                      isSelected
                        ? "bg-[var(--button)] text-black border-[var(--button)]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg">{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default EnhancementsStep;
