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

      const { data: businessData, error } = await supabaseClient
        .from("business")
        .select("*");

      if (error) {
        console.error("Error fetching businesses:", error.message);
        setLoading(false);
        return;
      }

      const withLogosAndMenu = await Promise.all(
        businessData.map(async (biz) => {
          const logoPath = `business/${biz.user_id}/${biz.business_id}/bot.ico`;
          const {
            data: { publicUrl },
          } = supabaseClient.storage.from("business").getPublicUrl(logoPath);

          const res = await fetch(publicUrl, { method: "HEAD" });

          const finalUrl = res.ok
            ? publicUrl
            : supabaseClient.storage
                .from("business")
                .getPublicUrl("menu_genie_logo_default.ico").data.publicUrl;

          const { data: menuItems } = await supabaseClient
            .from("menu_context")
            .select("business_id")
            .eq("business_id", biz.business_id)
            .eq("type","menu_type")
            .limit(1);

          const hasMenu = menuItems && menuItems.length > 0;
          console.log("Has Menu:",hasMenu)
          return {
            ...biz,
            logoUrl: finalUrl,
            hasMenu,
          };
        })
      );

      setBusinesses(withLogosAndMenu);
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
              onClick={() => navigate(`/dashboard/business/${biz.business_id}`)}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-4 transition hover:shadow-lg cursor-pointer"
            >
              <div className="flex justify-between items-center">
                {/* Business name and menu warning */}
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{biz.name}</p>
                  {!biz.hasMenu && (
                    <div className="group relative">
                      <span className="text-yellow-500 text-lg">⚠️</span>
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        No Menu Added
                      </div>
                    </div>
                  )}
                </div>

                {/* Business logo */}
                <img
                  src={biz.logoUrl}
                  alt="Business Logo"
                  className="w-8 h-8 object-contain border border-blue-500 rounded-full"
                />
              </div>

              {/* Extra caution message */}
              {!biz.hasMenu && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-3 py-2 rounded-md flex items-center gap-2">
                  ⚠️ <span>There is no menu added.</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
