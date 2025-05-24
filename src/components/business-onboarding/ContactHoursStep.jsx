import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ErrorMessage from "../util-components/ErrorMessage";

function ContactHoursStep({ data, onUpdate, onNext, onBack }) {
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [website, setWebsite] = useState(data.website || "");
  const [openingTime, setOpeningTime] = useState(data.openingTime ? new Date(`1970-01-01T${data.openingTime}`) : null);
  const [closingTime, setClosingTime] = useState(data.closingTime ? new Date(`1970-01-01T${data.closingTime}`) : null);
  const [error, setError] = useState("");

  const formatTime = (dateObj) => {
    if (!dateObj) return "";
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!phone || phone.trim().length < 6) {
      setError("Phone number is required and must be valid");
      return;
    }

    if (!openingTime || !closingTime) {
      setError("Please provide opening and closing times");
      return;
    }

    let finalWebsite = website.trim();
    if (finalWebsite && !/^https?:\/\//i.test(finalWebsite)) {
      finalWebsite = "https://" + finalWebsite;
    }

    const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (finalWebsite && !websitePattern.test(finalWebsite)) {
      setError("Please enter a valid website URL (e.g. https://example.com)");
      return;
    }

    setError("");
    onUpdate({
      email,
      phone,
      website: finalWebsite,
      openingTime: formatTime(openingTime),
      closingTime: formatTime(closingTime),
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <div className="focus-within:ring-2 focus-within:ring-blue-600 rounded-lg transition">
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={setPhone}
              inputStyle={{
                width: "100%",
                height: "42px",
                border: "none",
                fontSize: "1rem",
                paddingLeft: "48px",
              }}
              buttonStyle={{
                border: "none",
                borderRight: "1px solid #d1d5db",
                background: "white",
                borderRadius: "0.5rem 0 0 0.5rem",
              }}
              containerStyle={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                backgroundColor: "white",
              }}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            placeholder="https://yourbusiness.com"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <DatePicker
                selected={openingTime}
                onChange={(date) => setOpeningTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Opening"
                dateFormat="HH:mm"
                placeholderText="Opening Time"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <DatePicker
                selected={closingTime}
                onChange={(date) => setClosingTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Closing"
                dateFormat="HH:mm"
                placeholderText="Closing Time"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage errorMessage={error} />}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default ContactHoursStep;
