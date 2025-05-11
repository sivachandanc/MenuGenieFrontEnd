import { useState } from "react";
function BusinessInfoStep({ data, onUpdate, onNext }) {
  const [name, setName] = useState(data.business_name || "");
  const [type, setType] = useState(data.business_type || "");
  const [location, setLocation] = useState(data.location || "");
  const [businsessDescription, setBusinsessDescription] = useState(
    data.businsess_description || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ business_name: name, business_type: type, location });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Name
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
          Business Type
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
          Location (City, State)
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
          Business Description
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={4} // or whatever height you prefer
          value={businsessDescription}
          onChange={(e) => setBusinsessDescription(e.target.value)}
          required
        />  
      </div>

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
