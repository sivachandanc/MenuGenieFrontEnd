import { useState } from "react";

function ContactHoursStep({ data, onUpdate, onNext, onBack }) {
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [hours, setHours] = useState(data.hours || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ email, phone, hours });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
        <input
          type="text"
          placeholder="e.g., Mon–Fri 9am–9pm"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>

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
