import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { DeleteBusiness } from "../../supabase-utils/DeleteBusiness";
import { UpdateBusinessDescription } from "../../supabase-utils/update-business-info/updateBusinessDescription";
import { UpdateBusinessLocation } from "../../supabase-utils/update-business-info/UpdateBusinessLocation";
import { UpdateBusinessEmail } from "../../supabase-utils/update-business-info/UpdateBusinessEmail";
import { UpdateBusinessWebSite } from "../../supabase-utils/update-business-info/UpdateBusinessWebSite";
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
import EditableBusinessField from "./EditableBusinessField";

function BusinessDetails() {
  const { businessID } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMenu, setHasMenu] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

      const logoPath = `business_logo/${businessID}.png`;
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

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await DeleteBusiness(business.business_id, business.business_type);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete business:", err);
      setDeleting(false);
      alert("Failed to delete business. Please try again.");
    }
  };

  const handleDescriptionUpdate = async (newValue) => {
    try {
      await UpdateBusinessDescription(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, description: newValue }));
    } catch (err) {
      alert("Failed to update description with embedding. Check console.");
      console.error(err);
    }
  };

  const handleLocationUpdate = async (newValue) => {
    try {
      await UpdateBusinessLocation(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, location: newValue }));
    } catch (err) {
      alert("Failed to update Location with embedding. Check console.");
      console.error(err);
    }
  };

  const handleEmailUpdate = async (newValue) => {
    try {
      await UpdateBusinessEmail(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, email: newValue }));
    } catch (err) {
      alert("Failed to update Email with embedding. Check console.");
      console.error(err);
    }
  };

  const handleWebSiteUpdate = async (newValue) => {
    try {
      await UpdateBusinessWebSite(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, website: newValue }));
    } catch (err) {
      alert("Failed to update Email with embedding. Check console.");
      console.error(err);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              alert("Failed to convert image to PNG");
              return;
            }

            const filePath = `business_logo/${business.business_id}.png`;

            const { error: uploadError } = await supabaseClient.storage
              .from("business")
              .upload(filePath, blob, {
                contentType: "image/png",
                upsert: true,
              });

            if (uploadError) {
              console.error("Logo upload failed:", uploadError.message);
              alert("Failed to upload logo");
              return;
            }

            const { data: urlData } = supabaseClient.storage
              .from("business")
              .getPublicUrl(filePath);

            setBusiness((prev) => ({
              ...prev,
              logoUrl: urlData.publicUrl,
            }));
          },
          "image/png",
          1.0
        );
      };

      image.onerror = () => {
        alert("Failed to load image. Please try another file.");
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

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
      {/* Profile Card */}
      <div className="sm:w-1/3 flex flex-col items-center text-center bg-[#fef7ec] p-6 rounded-2xl shadow-md border">
        <div className="relative mb-4">
          <img
            src={business.logoUrl}
            alt="Business Logo"
            className="w-24 h-24 object-contain rounded-full border-4 border-[var(--button)]"
          />
          <label className="absolute bottom-0 right-0 bg-[var(--button)] text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-[var(--button-hover)]">
            Change
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>

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

      {/* Business Info */}
      <div className="sm:w-2/3 space-y-6">
        <div className="flex justify-end">
          <div className="group relative z-10">
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 transition rounded-full text-red-500 hover:text-red-700"
              title="Delete Business"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirm Deletion
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <strong>{business.name}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => !deleting && setShowConfirm(false)}
                  className="px-4 py-1 text-sm text-gray-700 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className={`px-4 py-1 text-sm text-white rounded flex items-center justify-center gap-2 transition ${
                    deleting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deleting && (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        <EditableBusinessField
          label="Description"
          value={business.description}
          icon={<Star size={16} />}
          type="textarea"
          validate={(v) => (!v ? "Description cannot be empty" : "")}
          onSave={handleDescriptionUpdate}
        />
        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          <EditableBusinessField
            label="Location"
            value={business.location}
            icon={<MapPin size={16} />}
            type="text"
            onSave={handleLocationUpdate}
          />
          <EditableBusinessField
            label="Email"
            value={business.email}
            icon={<Mail size={16} />}
            type="text"
            validate={(v) =>
              !v
                ? "Email is required"
                : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
                ? ""
                : "Invalid email"
            }
            onSave={handleEmailUpdate}
          />
          <EditableBusinessField
            label="Phone"
            value={business.phone}
            icon={<Phone size={16} />}
            type="phone"
          />
          <EditableBusinessField
            label="Website"
            value={business.website}
            icon={<Globe size={16} />}
            type="text"
            validate={(v) =>
              !v
                ? "Website is required"
                : /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/.test(v)
                ? ""
                : "Invalid website"
            }
            onSave={handleWebSiteUpdate}
          />
          <EditableBusinessField
            label="Opening Time"
            value={business.opening_time?.slice(0, 5)}
            icon={<Clock size={16} />}
            type="time"
          />
          <EditableBusinessField
            label="Closing Time"
            value={business.closing_time?.slice(0, 5)}
            icon={<Clock size={16} />}
            type="time"
          />
          <EditableBusinessField
            label="Ownership Tags"
            value={business.ownership_tags || []}
            icon={<Tags size={16} />}
            type="tags"
          />
          <EditableBusinessField
            label="Bot Personality"
            value={business.bot_personality}
            icon={<Smile size={16} />}
            type="select"
            options={["friendly", "professional", "funny"]}
            validate={(v) => (!v ? "Please select a personality" : "")}
          />
          <EditableBusinessField
            label="Bot Name"
            value={business.bot_name}
            icon={<Bot size={16} />}
            type="text"
            validate={(v) => (!v ? "Bot name cannot be empty" : "")}
          />
        </div>
      </div>
    </div>
  );
}

export default BusinessDetails;
