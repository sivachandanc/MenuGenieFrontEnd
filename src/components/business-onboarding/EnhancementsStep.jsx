import { useState } from "react";

function EnhancementsStep({ data, onUpdate, onNext, onBack }) {
  const [topItems, setTopItems] = useState(data.topItems || "");
  const [ownershipTags, setOwnershipTags] = useState(data.ownershipTags || []);

  const ownershipOptions = [
    { label: "Veteran Owned", emoji: "🎖️" },
    { label: "Female Owned", emoji: "👩‍💼" },
    { label: "LGBTQ Owned", emoji: "🏳️‍🌈" },
    { label: "Black Owned", emoji: "✊🏿" },
    { label: "First Responder Owned", emoji: "🚒" },
  ];

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Selling Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Top-Selling Items
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="e.g., Butter Chicken, Paneer Tikka"
          value={topItems}
          onChange={(e) => setTopItems(e.target.value)}
        />
      </div>

      {/* Ownership Tags as Emoji Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ownership Tags (optional)
        </label>
        <div className="flex flex-col gap-2">
          {ownershipOptions.map(({ label, emoji }) => {
            const isSelected = ownershipTags.includes(label);
            return (
              <button
                type="button"
                key={label}
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default EnhancementsStep;
