import { useState } from "react";
import BusinessInfoStep from "./BusinessInfoStep";
import ContactHoursStep from "./ContactHoursStep";
import EnhancementsStep from "./EnhancementsStep";
import BotCustomizationStep from "./BotCustomizationStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient.jsx";

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
      const {
        data: { session },
        error: sessionError,
      } = await supabaseClient.auth.getSession();

      if (sessionError || !session?.user) {
        setError("Authentication error. Please log in again.");
        return;
      }

      const userId = session.user.id;

      // Map formData to match Supabase column names
      const payload = {
        user_id: userId,
        name: formData.business_name,
        business_type: formData.business_type,
        location: formData.location,
        description: formData.business_description,
        email: formData.email,
        phone: formData.phone,
        opening_time: formData.openingTime,
        closing_time: formData.closingTime,
        website: formData.website,
        top_items: formData.topItems,
        ownership_tags: formData.ownershipTags,
        bot_name: formData.botName,
        bot_personality: formData.tone,
      };

      const { data, error } = await supabaseClient
        .from("business")
        .insert(payload)
        .select(); // optional: returns inserted row

      if (error) {
        console.error("Supabase insert error:", error);
        setError("Failed to submit business data.");
        return;
      }

      const body = [
        {
          context: `Top selling items(According to owner) is: ${data[0].top_items}`,
        },
        {
          context: `Name of ${data[0].business_type} is ${data[0].name}\nDescription:\n${data[0].description}\nLocation: ${data[0].location}\nOpens at:${data[0].opening_time}\nCloses at:${data[0].closing_time}`,
        },
        {
          context: `This cafe is a: ${data[0].ownership_tags.join(", ")}`,
        },
        {
          context: `Contact Info for any queries:\nEmail:${data[0].email}\nPhone Number:${data[0].phone}\nWebsite:${data[0].website}`,
        },
      ];
      console.log(JSON.stringify(body));
      const response = await fetch(
        `${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      console.log(response);

      if (!response.ok) {
        const errorText = await response.text(); // fallback if response isn't JSON
        console.error("Supabase insert error:", errorText);
        setError("Failed to submit business data.");
        return;
      }

      setError("");
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error("Submission error:", error);
      setError("Something went wrong. Please try again.");
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
