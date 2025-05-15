import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";
import { useNavigate } from "react-router-dom";

function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);

      // Fetch businesses from Supabase table
      const { data: businessData, error } = await supabaseClient
        .from("business")
        .select("*");

      if (error) {
        console.error("Error fetching businesses:", error.message);
        setLoading(false);
        return;
      }

      // Resolve logo URL for each business
      const withLogos = await Promise.all(
        businessData.map(async (biz) => {
          const path = `business/${biz.user_id}/${biz.business_id}/bot.ico`;
          const {
            data: { publicUrl },
          } = supabaseClient.storage.from("business").getPublicUrl(path);

          // Check if file is accessible
          const res = await fetch(publicUrl, { method: "HEAD" });

          // If not found, use default
          const finalUrl = res.ok
            ? publicUrl
            : supabaseClient.storage
                .from("business")
                .getPublicUrl("menu_genie_logo_default.ico").data.publicUrl;

          return {
            ...biz,
            logoUrl: finalUrl,
          };
        })
      );

      setBusinesses(withLogos);
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Businesses</h2>

      {loading ? (
        <p>
          <SkeletonCard />
        </p>
      ) : businesses.length === 0 ? (
        <div className="text-center border border-dashed border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <p className="text-gray-600 mb-4">
            You have no businesses onboarded with{" "}
            <span className="font-semibold text-[var(--button)]">
              MenuGenie
            </span>
            .
          </p>
          <button
            onClick={() => navigate("/dashboard/onboarding")}
            className="px-5 py-2 rounded-full bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)] transition"
          >
            Add Business
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((biz) => (
            <li
              key={biz.business_id}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-4 transition hover:shadow-lg cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{biz.name}</p>
                <img
                  src={biz.logoUrl}
                  alt="Business Logo"
                  className="w-8 h-8 object-contain border border-blue-500 rounded-full"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
