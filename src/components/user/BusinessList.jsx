import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";


function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("business")
        .select("*");

      if (error) {
        console.error("Error fetching businesses:", error.message);
      } else {
        setBusinesses(data);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Businesses</h2>

      {loading ? (
        <p><SkeletonCard/></p>
      ) : businesses.length === 0 ? (
        <div className="text-center border border-dashed border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <p className="text-gray-600 mb-4">
            You have no businesses onboarded with <span className="font-semibold text-[var(--button)]">MenuGenie</span>.
          </p>
          <button className="px-5 py-2 rounded-full bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)] transition">
            Add Business
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {businesses.map((biz) => (
            <li key={biz.business_id} className="border rounded p-3 bg-white shadow-sm">
              <p className="font-semibold">{biz.name}</p>
              <p className="text-sm text-gray-500">{biz.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
