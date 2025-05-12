import { useState } from "react";
import ErrorMessage from "../util-components/ErrorMessage";

function BusinessInfoStep({ data, onUpdate, onNext }) {
  const [name, setName] = useState(data.business_name || "");
  const [type, setType] = useState(data.business_type || "");
  const [location, setLocation] = useState(data.location || "");
  const [businessDescription, setBusinsessDescription] = useState(
    data.business_description || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length ==0){
        setError("Name is required");
        return;
    }
    if (location.trim().length ==0){
        setError("Location is required");
        return;
    }
    if (businessDescription.trim().length ==0){
        setError("Business Descitpion is required");
        return;
    }

    if (!type) {
        setError("Business type is required");
        return;
      }
    setError("")
    onUpdate({ business_name: name, business_type: type, location, business_description: businessDescription });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select type</option>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Café</option>
          <option value="food_truck">Food Truck</option>
          <option value="bakery">Bakery</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location (City, State) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={4}
          placeholder="This helps your chatbot better represent your brand. Mention what you specialize in, your mission, or what you're proud of."
          value={businessDescription}
          onChange={(e) => setBusinsessDescription(e.target.value)}
          required
        />
      </div>
      {error && <ErrorMessage errorMessage={error} />}
      <div className="text-right">
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

export default BusinessInfoStep;
