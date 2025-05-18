import { useState } from "react";
import BusinessInfoStep from "./BusinessInfoStep";
import ContactHoursStep from "./ContactHoursStep";
import EnhancementsStep from "./EnhancementsStep";
import BotCustomizationStep from "./BotCustomizationStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import { insertBusinessAndEmbed } from "../../supabase-utils/InsertBusinessAndEmbed";

//TODO: Need to add process to persist the data
const steps = [
  "Business Info",
  "Contact & Hours",
  "Enhancements",
  "Bot Customization",
  "Review & Submit",
];

function OnBoardingWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (index) => setStep(index);

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFinish = async () => {
    console.log("Final submission:", formData); // Optional: remove in production
  
    try {
      setError(""); // clear previous error if any
  
      const { business, inserted_contexts } = await insertBusinessAndEmbed(formData);
  
      console.log("Business inserted:", business);
      console.log("Context embeddings stored:", inserted_contexts);
  
      // Success — you can redirect or show a toast here
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const StepComponent = [
    <BusinessInfoStep data={formData} onNext={next} onUpdate={updateData} />,
    <ContactHoursStep
      data={formData}
      onNext={next}
      onBack={back}
      onUpdate={updateData}
    />,
    <EnhancementsStep
      data={formData}
      onNext={next}
      onBack={back}
      onUpdate={updateData}
    />,
    <BotCustomizationStep
      data={formData}
      onNext={next}
      onBack={back}
      onUpdate={updateData}
    />,
    <ReviewSubmitStep
      data={formData}
      onBack={back}
      onEdit={goToStep}
      onFinish={handleFinish}
      error={error}
    />,
  ][step];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] py-10 px-4">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
        {/* Progress Pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300
        ${index <= step ? "bg-[var(--button)]" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* Step Title */}
        <div>
          <div className="text-sm text-gray-600">
            Step {step + 1} of {steps.length}
          </div>
          <h2 className="text-2xl font-bold">{steps[step]}</h2>
        </div>

        {/* Step Component */}
        {StepComponent}
      </div>
    </div>
  );
}

export default OnBoardingWizard;
