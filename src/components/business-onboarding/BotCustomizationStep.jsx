import { useState } from "react";

function BotCustomizationStep({ data, onUpdate, onNext, onBack }) {
    const [botName, setBotName] = useState(data.botName || "");
    const [tone, setTone] = useState(data.tone || "friendly");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate({ botName, tone });
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bot Name</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., GenieBot"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Chatbot Tone</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
          </select>
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

export default BotCustomizationStep;