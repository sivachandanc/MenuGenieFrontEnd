import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { QrCode } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Businesses</h2>

      {loading ? (
        <SkeletonCard />
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
        <ul className="relative flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {businesses.map((biz) => {
            const isFlipped = flippedCardId === biz.business_id;
            const qrUrl = `https://menu-genie-front-end.vercel.app/chat-with-menu/${biz.business_id}`;

            return (
              <motion.li
                key={biz.business_id}
                className="relative flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden mx-2 sm:mx-0 mb-6 min-h-[400px]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {!isFlipped ? (
                  <div
                    style={{ backfaceVisibility: "hidden" }}
                    className="flex flex-col h-full"
                  >
                    {/* Clickable logo area flips the card */}
                    <div
                      onClick={(e) => toggleCardFlip(biz.business_id, e)}
                      className="bg-gray-100 flex items-center justify-center p-6 cursor-pointer"
                    >
                      <img
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="w-32 h-32 object-contain rounded-xl"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between gap-4 flex-grow">
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
                        <p className="text-gray-600 text-sm">
                          {biz.business_type.charAt(0).toUpperCase() +
                            biz.business_type.slice(1)}{" "}
                          Business
                        </p>
                      </div>

                      {biz.hasMenu ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/business/${biz.business_id}`);
                          }}
                          className="mt-2 px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--button)] to-[var(--button-hover)] shadow hover:shadow-lg transition w-fit"
                        >
                          Manage Business
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/dashboard/business/${biz.business_id}/menu`
                              );
                            }}
                            className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] shadow-md w-fit"
                          >
                            + Add Menu
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={(e) => toggleCardFlip(biz.business_id, e)}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white space-y-4 p-6 cursor-pointer"
                  >
                    <QRCode value={qrUrl} size={128} />
                    <span className="text-sm text-gray-500">Tap to return</span>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
