function ReviewSubmitStep({ data, onBack }) {
    const handleFinish = () => {
      console.log("Final submission:", data);
      // TODO: Save to Supabase and redirect to dashboard
    };
  
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Review Your Info</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
  
        <div className="flex justify-between">
          <button onClick={onBack} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            Back
          </button>
          <button onClick={handleFinish} className="px-4 py-2 rounded bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]">
            Finish Setup
          </button>
        </div>
      </div>
    );
  }

export default ReviewSubmitStep;
