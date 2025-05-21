import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import SkeletonCard from "../util-components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

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
              `Could not check table "${menuTable}" for business "${biz.name}": ${err.message}`,
              err
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
        <ul className="relative flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {businesses.map((biz) => {
            const isFlipped = flippedCardId === biz.business_id;

            return (
              <li
                key={biz.business_id}
                className="relative w-full h-80 mx-2 sm:mx-0 mb-6"
                style={{ perspective: 1000 }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front Face */}
                  <div
                    className="absolute w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                    onClick={() =>
                      navigate(`/dashboard/business/${biz.business_id}`)
                    }
                  >
                    <div className="bg-gray-100 flex items-center justify-between p-4">
                      <img
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="w-24 h-24 object-contain rounded-xl"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlippedCardId(biz.business_id);
                        }}
                        className="text-xs px-2 py-1 bg-gray-200 rounded"
                      >
                        QR
                      </button>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {biz.name}
                      </h3>
                      <p className="text-gray-600 text-sm capitalize">
                        {biz.business_type} Business
                      </p>
                      {biz.hasMenu ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full w-fit">
                          Has Menu
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full w-fit">
                          No Menu Yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Back Face */}
                  <div
                    className="absolute w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-6"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <QRCode
                      value={`https://menu-genie-front-end.vercel.app/chat-with-menu/${biz.business_id}`}
                      size={128}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedCardId(null);
                      }}
                      className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-full shadow hover:bg-gray-200 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Card
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BusinessList;
