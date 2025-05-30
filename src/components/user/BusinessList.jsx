import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { QrCode, Utensils, Share } from "lucide-react";

function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState(null);
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
          const logoPath = `business_logo/${biz.business_id}.png`;
          const {
            data: { publicUrl },
          } = supabaseClient.storage.from("business").getPublicUrl(logoPath);
          const res = await fetch(publicUrl, { method: "HEAD" });

          const finalUrl = res.ok
            ? publicUrl
            : supabaseClient.storage
                .from("business")
                .getPublicUrl("menu_genie_logo_default.png").data.publicUrl;

          let hasMenu = false;
          const businessType = biz.business_type;
          const menuTable = `menu_item_${businessType}`;

          try {
            const { data: menuItems, error: menuError } = await supabaseClient
              .from(menuTable)
              .select("item_id")
              .eq("business_id", biz.business_id)
              .limit(1);

            if (!menuError && menuItems?.length > 0) {
              hasMenu = true;
            }
          } catch (err) {
            console.warn(
              `Could not check table "${menuTable}" for ${biz.name}`,
              err.message
            );
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

  const toggleCardFlip = (businessId, e) => {
    e.stopPropagation();
    setFlippedCardId((prev) => (prev === businessId ? null : businessId));
  };

  const handleShare = async (url, businessName) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${businessName} on MenuGenie`,
          text: `Check out ${businessName} on MenuGenie!`,
          url,
        });
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch {
        alert("Unable to share. Please copy the link manually.");
      }
    }
  };

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
            className="px-5 py-2 rounded-full text-black font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition"
          >
            Add Business
          </button>
        </div>
      ) : (
        <ul className="relative flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {businesses.map((biz, index) => {
            const isFlipped = flippedCardId === biz.business_id;
            const qrUrl = `https://menugenie.io/chat-with-menu/${biz.business_id}`;

            return (
              <li
                key={biz.business_id}
                onClick={(e) => toggleCardFlip(biz.business_id, e)}
                style={{ top: 0, zIndex: index }}
                className={`sticky sm:static sm:top-auto sm:z-auto transition-all duration-500 ease-in-out 
                  flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.01] 
                  cursor-pointer mx-2 sm:mx-0 mb-6 relative ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
              >
                {!isFlipped ? (
                  <>
                    <div className="bg-gray-100 flex items-center justify-center p-6">
                      <img
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="w-32 h-32 object-contain rounded-xl"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-sm text-[var(--button)] font-semibold mb-1">
                          Active
                        </p>
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
                            {biz.name}
                          </h3>
                          <button
                            onClick={(e) => toggleCardFlip(biz.business_id, e)}
                            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 ml-2"
                          >
                            <QrCode size={18} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm capitalize">
                          {biz.business_type} business
                        </p>
                      </div>

                      {biz.hasMenu ? (
                        <button
                          onClick={() => {
                            navigate(`business/${biz.business_id}`);
                          }}
                          className="mt-2 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)] shadow hover:shadow-lg transition w-fit"
                        >
                          <Utensils size={18} />
                        </button>
                      ) : (
                        <div className="flex flex-row gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/dashboard/business/${biz.business_id}/menu`
                              );
                            }}
                            className="mt-2 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)] shadow hover:shadow-lg transition w-fit"
                          >
                            + Add Menu
                          </button>
                          <button
                            onClick={() => {
                              navigate(`business/${biz.business_id}`);
                            }}
                            className="mt-2 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)] shadow hover:shadow-lg transition w-fit"
                          >
                            <Utensils size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    onClick={(e) => toggleCardFlip(biz.business_id, e)}
                    className="flex items-center justify-center h-full p-6 bg-white cursor-pointer"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)]">
                        <div className="bg-white rounded-xl p-2">
                          <div className="relative w-[128px] h-[128px]">
                            <QRCode value={qrUrl} size={128} />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(qrUrl, biz.name);
                        }}
                        className="mt-2 px-4 py-1.5 text-sm bg-[var(--button)] hover:bg-[var(--button-hover)] text-white rounded-full shadow"
                      >
                        <Share />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
