import { useState } from "react";

function MenuUploadStep({ data, onUpdate, onNext, onBack }) {
  const [menuText, setMenuText] = useState(data.menuText || "");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ menuText, menuFile: file });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Paste Your Menu</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="6"
          value={menuText}
          onChange={(e) => setMenuText(e.target.value)}
          placeholder="e.g., Tandoori Chicken - Spicy grilled chicken with spices..."
        ></textarea>
      </div>

      <div className="text-center text-gray-500">— OR —</div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Menu File (PDF or Image)</label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

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

export default MenuUploadStep;
