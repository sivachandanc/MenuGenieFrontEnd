import { useState } from "react";
import ErrorMessage from "../util-components/ErrorMessage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

function ContactHoursStep({ data, onUpdate, onNext, onBack }) {
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [openingTime, setOpeningTime] = useState(data.openingTime || "");
  const [closingTime, setClosingTime] = useState(data.closingTime || "");
  const [error, setError] = useState("");

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

    setError("");
    onUpdate({ email, phone, openingTime, closingTime });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <div className="focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 rounded-md transition">
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
              outline: "none",
            }}
            buttonStyle={{
              border: "none",
              borderRight: "1px solid #d1d5db",
              background: "white",
              borderRadius: "0.375rem 0 0 0.375rem",
            }}
            containerStyle={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
            }}
            inputClass="focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
        <div className="flex gap-4">
          <div className="flex-1 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 rounded-md transition">
            <TimePicker
              onChange={setOpeningTime}
              value={openingTime}
              className="w-full"
              clearIcon={null}
              disableClock
            />
          </div>
          <div className="flex-1 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 rounded-md transition">
            <TimePicker
              onChange={setClosingTime}
              value={closingTime}
              className="w-full"
              clearIcon={null}
              disableClock
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage errorMessage={error} />}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)]"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default ContactHoursStep;
