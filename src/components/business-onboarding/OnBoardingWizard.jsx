// src/components/OnboardingWizard.jsx
import { useState } from "react";
import BusinessInfoStep from "./BusinessInfoStep";
import ContactHoursStep from "./ContactHoursStep";
// import EnhancementsStep from "./EnhancementsStep";
// import BotCustomizationStep from "./BotCustomizationStep";
// import ReviewSubmitStep from "./ReviewSubmitStep";

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

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const StepComponent = [
    <BusinessInfoStep data={formData} onNext={next} onUpdate={updateData} />, 
    <ContactHoursStep data={formData} onNext={next} onBack={back} onUpdate={updateData} />, 
    // <EnhancementsStep data={formData} onNext={next} onBack={back} onUpdate={updateData} />, 
    // <BotCustomizationStep data={formData} onNext={next} onBack={back} onUpdate={updateData} />, 
    // <ReviewSubmitStep data={formData} onBack={back} />
  ][step];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="mb-4">
        <div className="text-sm text-gray-600">Step {step + 1} of {steps.length}</div>
        <h2 className="text-2xl font-bold">{steps[step]}</h2>
      </div>
      {StepComponent}
    </div>
  );
}

export default OnBoardingWizard;
