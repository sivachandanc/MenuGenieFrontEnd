import { useState } from "react";
import BusinessInfoStep from "./BusinessInfoStep";
import ContactHoursStep from "./ContactHoursStep";
import EnhancementsStep from "./EnhancementsStep";
import BotCustomizationStep from "./BotCustomizationStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { insertBusinessAndEmbed } from "../../supabase-utils/InsertBusinessAndEmbed";

const steps = [
  "Business Info",
  "Contact & Hours",
  "Enhancements",
  "Bot Customization",
  "Review & Submit",
];

function OnBoardingWizard() {
  const navigate = useNavigate();
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
    try {
      setError("");

      const { business, inserted_contexts } = await toast.promise(
        insertBusinessAndEmbed(formData),
        {
          loading: "Submitting your business...",
          success: "Business successfully onboarded!",
          error: (err) =>
            err.message || "Something went wrong. Please try again.",
        }
      );

      console.log("Business inserted:", business);
      console.log("Context embeddings stored:", inserted_contexts);

      // Let toast show for 1 sec, then navigate
      setTimeout(() => {
        navigate("/dashboard", { replace: true }); // replace prevents back to review step
      }, 1000);
    } catch (err) {
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
    <div className="flex-1 overflow-y-auto bg-[var(--background)] px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl space-y-8">
        {/* Progress Pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                index <= step ? "bg-[var(--button)]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step Title */}
        <div className="text-center">
          <div className="text-sm text-gray-500 font-medium">
            Step {step + 1} of {steps.length}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{steps[step]}</h2>
        </div>

        {/* Step Component */}
        <div className="px-2 md:px-8">{StepComponent}</div>
      </div>
    </div>
  );
}

export default OnBoardingWizard;
