import { useState } from "react";
import { Pencil } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import CustomSpinner from "../util-components/Spinner";

const BOT_PERSONALITIES = ["friendly", "professional", "funny"];
const TAG_OPTIONS = ["women-owned", "family-owned", "black-owned"];

function EditableBusinessField({ label, value, icon, type, options = [], validate, placeholder, onSave , highlight}) {
  const [editing, setEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || "");
  const [error, setError] = useState("");
  const [savingInProgress, setSavingInProgress] = useState(false)

  const validateInput = () => {
    if (validate) {
      const err = validate(fieldValue);
      if (err) {
        setError(err);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    setSavingInProgress(true)
    e.preventDefault();
    if (validateInput()) {
      if (typeof onSave === "function") {
        await onSave(fieldValue);
      }
      setSavingInProgress(false)
      setEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 relative group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2">
          <div className="pt-1 text-gray-500">{icon}</div>
          <div>
            <p className="font-medium text-gray-500">{label}</p>
            { highlight? (<span class="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[var(--label)]">
    <span class="relative text-white dark:text-gray-950">{value || "—"}</span>
  </span>):(<p className="text-gray-800 whitespace-pre-wrap">{value || "—"}</p>)}
            
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="text-gray-400 hover:text-blue-600 transition"
          title={`Edit ${label}`}
        >
          <Pencil size={16} />
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="mt-1 bg-gray-50 border border-gray-300 rounded p-2 text-sm shadow-sm">
            
          {type === "textarea" && (
            <textarea
              className="w-full px-2 py-1 border border-gray-300 rounded"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              placeholder={placeholder}
            />
          )}

          {type === "text" && (
            <input
              className="w-full px-2 py-1 border border-gray-300 rounded"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              placeholder={placeholder}
            />
          )}

          {type === "select" && (
            <select
              className="w-full px-2 py-1 border border-gray-300 rounded"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
            >
              <option value="">-- Select --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {type === "phone" && (
            <PhoneInput
              country={'us'}
              value={fieldValue}
              onChange={setFieldValue}
              inputClass="w-full"
            />
          )}

          {type === "time" && (
            <TimePicker
              onChange={setFieldValue}
              value={fieldValue}
              className="w-full border border-gray-300 rounded"
              disableClock={true}
            />
          )}

          {type === "tags" && (
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    fieldValue.includes(tag)
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => {
                    setFieldValue((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          <div className="flex justify-end mt-2 gap-2">
            <button type="button" onClick={() => setEditing(false)} className="text-gray-500 text-xs">Cancel</button>
            <button type="submit" className="text-blue-600 text-xs font-medium">Save</button>
            {savingInProgress && <CustomSpinner/>}
          </div>
        </form>
      )}
    </div>
  );
}

export default EditableBusinessField;