import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

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
          // ✅ Get logo
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

          // ✅ Check menu existence
          let hasMenu = false;
          const businessType = biz.business_type;
          const menuTable = `menu_item_${businessType}`;

          try {
            const { data: menuItems, error: menuError } = await supabaseClient
              .from(menuTable)
              .select("item_id")
              .eq("business_id", biz.business_id)
              .limit(1);
            console.log("Menu Data is:",biz.business_id)

            if (!menuError && menuItems?.length > 0) {
              hasMenu = true;
            }
          } catch (err) {
            console.warn(`Could not check table "${menuTable}" for ${biz.name}`, err.message);
          }

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
        <p><SkeletonCard /></p>
      ) : businesses.length === 0 ? (
        <div className="text-center border border-dashed border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <p className="text-gray-600 mb-4">
            You have no businesses onboarded with{" "}
            <span className="font-semibold text-[var(--button)]">MenuGenie</span>.
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
            className="flex flex-col sm:flex-row bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition cursor-pointer"
          >
            {/* Left: Business Logo */}
            <div className="sm:w-1/2 bg-gray-100 flex items-center justify-center p-6">
              <img
                src={biz.logoUrl}
                alt={biz.name}
                className="w-32 h-32 object-contain rounded-xl"
              />
            </div>
          
            {/* Right: Business Info */}
            <div className="sm:w-1/2 p-6 flex flex-col justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--button)] font-semibold mb-1">Active</p>
                <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{biz.name}</h3>
                <p className="text-gray-600 text-sm">
                  {biz.business_type.charAt(0).toUpperCase() + biz.business_type.slice(1)} Business
                </p>
              </div>
          
              {biz.hasMenu ? (
                <button className="mt-2 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)] shadow hover:shadow-lg transition w-fit">
                  Manage Business
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/business/${biz.business_id}/menu`);
                    }}
                    className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] shadow-md w-fit"
                  >
                    + Add Menu
                  </button>
                </div>
              )}
            </div>
          </li>
          
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
