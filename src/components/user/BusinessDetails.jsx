import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { DeleteBusiness } from "../../supabase-utils/DeleteBusiness"; // adjust path if needed
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  Star,
  Tags,
  Bot,
  Smile,
  AlertTriangle,
  Utensils,
  Trash2,
} from "lucide-react";

function BusinessDetails() {
  const { businessID } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMenu, setHasMenu] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabaseClient
        .from("business")
        .select("*")
        .eq("business_id", businessID)
        .single();

      if (error) {
        console.error("Error fetching business details:", error.message);
        return;
      }

      const logoPath = `business/${data.user_id}/${data.business_id}/bot.png`;
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("business").getPublicUrl(logoPath);

      const res = await fetch(publicUrl, { method: "HEAD" });
      const finalUrl = res.ok
        ? publicUrl
        : supabaseClient.storage
            .from("business")
            .getPublicUrl("menu_genie_logo_default.png").data.publicUrl;

      setBusiness({ ...data, logoUrl: finalUrl });

      const menuTable = `menu_item_${data.business_type
        ?.toLowerCase()
        .replace(/\s+/g, "_")}`;
      try {
        const { data: menuItems } = await supabaseClient
          .from(menuTable)
          .select("item_id")
          .eq("business_id", businessID)
          .limit(1);

        setHasMenu(menuItems && menuItems.length > 0);
      } catch (err) {
        console.warn(`Failed to query menu table "${menuTable}":`, err.message);
        setHasMenu(false);
      }

      setLoading(false);
    };

    fetchBusiness();
  }, [businessID]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-1/3 bg-gray-300 rounded" />
          <div className="w-14 h-14 bg-gray-300 rounded-full border border-blue-300" />
        </div>
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array(12)
            .fill()
            .map((_, idx) => (
              <div key={idx}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-5 w-full bg-gray-300 rounded" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-lg flex flex-col sm:flex-row gap-10">
      {/* Profile Card (left column) */}
      <div className="sm:w-1/3 flex flex-col items-center text-center bg-[#fef7ec] p-6 rounded-2xl shadow-md border">
        <img
          src={business.logoUrl}
          alt="Business Logo"
          className="w-24 h-24 object-contain rounded-full border-4 border-[var(--button)] mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
        <p className="text-sm text-gray-600 capitalize">
          {business.business_type}
        </p>

        {hasMenu ? (
          <button
            onClick={() =>
              (window.location.href = `/dashboard/business/${businessID}/menu`)
            }
            className="mt-6 px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition shadow"
          >
            <div className="flex flex-row space-x-1">
              <Utensils size={25} />
              <span>View Menu</span>
            </div>
          </button>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-sm text-yellow-700 flex items-center gap-1">
              <AlertTriangle size={16} /> No Menu Added
            </p>
            <button
              onClick={() =>
                (window.location.href = `/dashboard/business/${businessID}/menu`)
              }
              className="text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition shadow"
            >
              + Add Menu
            </button>
          </div>
        )}
      </div>

      {/* Business Info (right column) */}
      <div className="sm:w-2/3 space-y-6 relative">
        {/* Delete button with animation */}
        <div className="absolute top-0 right-0 group z-20">
          <button
            onClick={async () => {
              setDeleting(true);
              try {
                await DeleteBusiness(
                  business.business_id,
                  business.business_type
                );
                navigate("/dashboard");
              } catch (err) {
                console.error("Failed to delete business:", err);
                setDeleting(false);
                alert("Failed to delete business. Please try again.");
              }
            }}
            className={`p-2 transition rounded-full ${
              deleting
                ? "bg-red-100 border border-red-400 animate-spin"
                : "text-red-500 hover:text-red-700"
            }`}
            title="Delete Business"
          >
            {deleting ? (
              <div className="w-5 h-5 rounded-full border-2 border-red-500 border-t-transparent" />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
          {!deleting && (
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block bg-red-500 text-white text-xs font-medium px-2 py-1 rounded shadow-lg z-10">
              Delete Business
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Description
          </h3>
          <p className="text-gray-600">{business.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          <Info
            label="Location"
            value={business.location}
            icon={<MapPin size={16} />}
          />
          <Info
            label="Email"
            value={business.email}
            icon={<Mail size={16} />}
          />
          <Info
            label="Phone"
            value={business.phone}
            icon={<Phone size={16} />}
          />
          <Info
            label="Website"
            value={business.website}
            icon={<Globe size={16} />}
          />
          <Info
            label="Opening Time"
            value={business.opening_time?.slice(0, 5)}
            icon={<Clock size={16} />}
          />
          <Info
            label="Closing Time"
            value={business.closing_time?.slice(0, 5)}
            icon={<Clock size={16} />}
          />
          <Info
            label="Top Items"
            value={business.top_items}
            icon={<Star size={16} />}
          />
          <Info
            label="Ownership Tags"
            value={business.ownership_tags?.join(", ")}
            icon={<Tags size={16} />}
          />
          <Info
            label="Bot Personality"
            value={business.bot_personality}
            icon={<Smile size={16} />}
          />
          <Info
            label="Bot Name"
            value={business.bot_name}
            icon={<Bot size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex items-start gap-2 group">
      <div className="pt-1 text-gray-500 group-hover:text-[var(--text-main)] transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="relative z-10 font-medium text-gray-500 group-hover:text-[var(--text-main)] transition-colors duration-300">
          {label}
        </p>
        <p className="text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

export default BusinessDetails;
