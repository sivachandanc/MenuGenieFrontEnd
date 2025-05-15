import ErrorMessage from "../util-components/ErrorMessage";

function ReviewSubmitStep({ data, onBack, onEdit, onFinish , error}) {
    const Section = ({ title, step, children }) => (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <button
            onClick={() => onEdit(step)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-2">{children}</div>
      </div>
    );
  
    const renderRow = (label, value) => (
      <div className="flex gap-2">
        <span className="w-32 font-medium">{label}:</span>
        <span className="text-gray-800">{value || "—"}</span>
      </div>
    );
  
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Review Your Information</h3>
  
        <Section title="Business Details" step={0}>
          {renderRow("Name", data.business_name)}
          {renderRow("Type", data.business_type)}
          {renderRow("Location", data.location)}
          {renderRow("Description", data.business_description)}
        </Section>
  
        <Section title="Contact Information" step={1}>
          {renderRow("Email", data.email)}
          {renderRow("Phone", data.phone)}
          {renderRow("Hours", `${data.openingTime || "—"} – ${data.closingTime || "—"}`)}
          {renderRow("Website", data.website)}
        </Section>
  
        <Section title="Enhancements" step={2}>
          {renderRow("Top-Selling Items", data.topItems)}
          {renderRow(
            "Ownership Tags",
            data.ownershipTags?.length > 0 ? data.ownershipTags.join(", ") : "—"
          )}
        </Section>
          {error && <ErrorMessage errorMessage={error}/> }
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={onFinish}
            className="px-4 py-2 rounded bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]"
          >
            Finish Setup
          </button>
        </div>
      </div>
    );
  }
  
  export default ReviewSubmitStep;
  