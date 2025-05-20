import { useState } from "react";
import ErrorMessage from "../util-components/ErrorMessage";

function ReviewSubmitStep({ data, onBack, onEdit, onFinish, error }) {
  const [loading, setLoading] = useState(false);

  const Section = ({ title, step, children }) => (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <button
          onClick={() => onEdit(step)}
          className="text-sm text-[var(--button)] font-medium hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const renderRow = (label, value, isTag = false) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {isTag ? (
        <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
          {value?.length > 0
            ? value.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-[var(--button)] text-black font-medium"
                >
                  {tag}
                </span>
              ))
            : <span className="text-gray-500">—</span>}
        </div>
      ) : (
        <span className="text-sm text-gray-900 mt-1 sm:mt-0">{value || "—"}</span>
      )}
    </div>
  );

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onFinish();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">📋 Review Your Information</h3>

      <Section title="Business Details" step={0}>
        {renderRow("Name", data.business_name)}
        {renderRow("Type", data.business_type)}
        {renderRow("Location", data.location)}
        {renderRow("Description", data.business_description)}
      </Section>

      <Section title="Contact & Hours" step={1}>
        {renderRow("Email", data.email)}
        {renderRow("Phone", data.phone)}
        {renderRow("Hours", `${data.openingTime || "—"} – ${data.closingTime || "—"}`)}
        {renderRow("Website", data.website)}
      </Section>

      <Section title="Enhancements" step={2}>
        {renderRow("Top-Selling Items", data.topItems)}
        {renderRow("Ownership Tags", data.ownershipTags, true)}
      </Section>

      {error && <ErrorMessage errorMessage={error} />}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          Back
        </button>

        <button
          onClick={handleFinish}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${
            loading
              ? "bg-green-100 text-gray-700 cursor-not-allowed"
              : "bg-[var(--button)] text-black hover:bg-[var(--button-hover)]"
          }`}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Finishing..." : "Finish Setup"}
        </button>
      </div>
    </div>
  );
}

export default ReviewSubmitStep;
