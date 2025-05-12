import { useState } from "react";
import ErrorMessage from "../util-components/ErrorMessage";

function BotCustomizationStep({ data, onUpdate, onNext, onBack }) {
    const [botName, setBotName] = useState(data.botName || "");
    const [tone, setTone] = useState(data.tone || "friendly");
    const [error, setError] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (botName.trim().length == 0){
        setError("Please give your bot a name!!");
        return
      }
      if (!tone){
        setError("Please set tone of the bot!!");
        return
      }
      setError("");
      onUpdate({ botName, tone });
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
        {error && <ErrorMessage errorMessage={error} />}
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