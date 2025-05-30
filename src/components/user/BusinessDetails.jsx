import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import { DeleteBusiness } from "../../supabase-utils/DeleteBusiness";
import { UpdateBusinessDescription } from "../../supabase-utils/update-business-info/updateBusinessDescription";
import { UpdateBusinessLocation } from "../../supabase-utils/update-business-info/UpdateBusinessLocation";
import { UpdateBusinessEmail } from "../../supabase-utils/update-business-info/UpdateBusinessEmail";
import { UpdateBusinessWebSite } from "../../supabase-utils/update-business-info/UpdateBusinessWebSite";
import { UpdateBusinessPhoneNumber } from "../../supabase-utils/update-business-info/UpdateBusinessPhoneNumber";
import { UpdateBusinessOpeningTime } from "../../supabase-utils/update-business-info/UpdateBusinessOpeningTime";
import { UpdateBusinessClosingTime } from "../../supabase-utils/update-business-info/UpdateBusinessClosingTime";
import { UpdateBusinessName } from "../../supabase-utils/update-business-info/UpdateBusinessName";
import { UpdateBusinessTags } from "../../supabase-utils/update-business-info/UpdateBusinessTags";
import { UpdateBotPersonality } from "../../supabase-utils/update-business-info/UpdateBotPersonality";
import { UpdateBotName } from "../../supabase-utils/update-business-info/UpdateBotName";
import MenuIcon from "../../assets/menu.png";
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
  Trash2,
  Pencil,
  List
} from "lucide-react";
import EditableBusinessField from "./EditableBusinessField";
import toast from "react-hot-toast";

function BusinessDetails() {
  const { businessID } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMenu, setHasMenu] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabaseClient
        .from("business")
        .select("*")
        .eq("business_id", businessID)
        .single();

      if (error) {
        toast.error("Failed to fetch business details.");
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
      } catch {
        toast.error("Failed to fetch menu info");
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
      toast.success("Business deleted successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete business. Please try again.");
      setDeleting(false);
    }
  };

  const handleDescriptionUpdate = async (newValue) => {
    try {
      await UpdateBusinessDescription(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, description: newValue }));
      toast.success("Description updated");
    } catch {
      toast.error("Failed to update description");
    }
  };

  const handleLocationUpdate = async (newValue) => {
    try {
      await UpdateBusinessLocation(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, location: newValue }));
      toast.success("Location updated");
    } catch {
      toast.error("Failed to update location");
    }
  };

  const handleEmailUpdate = async (newValue) => {
    try {
      await UpdateBusinessEmail(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, email: newValue }));
      toast.success("Email updated");
    } catch {
      toast.error("Failed to update email");
    }
  };

  const handleWebSiteUpdate = async (newValue) => {
    try {
      await UpdateBusinessWebSite(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, website: newValue }));
      toast.success("Website updated");
    } catch {
      toast.error("Failed to update website");
    }
  };

  const handlePhoneNumberUpdate = async (newValue) => {
    try {
      await UpdateBusinessPhoneNumber(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, phone: newValue }));
      toast.success("Phone updated");
    } catch {
      toast.error("Failed to update phone");
    }
  };

  const handleOpeningTimeUpdate = async (newValue) => {
    try {
      await UpdateBusinessOpeningTime(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, opening_time: newValue }));
      toast.success("Opening time updated");
    } catch {
      toast.error("Failed to update opening time");
    }
  };

  const handleClosingTimeUpdate = async (newValue) => {
    try {
      await UpdateBusinessClosingTime(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, closing_time: newValue }));
      toast.success("Closing time updated");
    } catch {
      toast.error("Failed to update closing time");
    }
  };

  const handleBusinessNameUpdate = async (newValue) => {
    try {
      await UpdateBusinessName(businessID, newValue, business);
      setBusiness((prev) => ({ ...prev, name: newValue }));
      toast.success("Business name updated");
    } catch {
      toast.error("Failed to update business name");
    }
  };

  const handleBusinessTagsUpdate = async (newValue) => {
    try {
      await UpdateBusinessTags(businessID, newValue);
      setBusiness((prev) => ({ ...prev, ownership_tags: newValue }));
      toast.success("Tags updated");
    } catch {
      toast.error("Failed to update tags");
    }
  };

  const handleBotNameUpdate = async (newValue) => {
    try {
      await UpdateBotName(businessID, newValue);
      setBusiness((prev) => ({ ...prev, bot_name: newValue }));
      toast.success("Bot name updated");
    } catch {
      toast.error("Failed to update bot name");
    }
  };

  const handleBotPersonalityUpdate = async (newValue) => {
    try {
      await UpdateBotPersonality(businessID, newValue);
      setBusiness((prev) => ({ ...prev, bot_personality: newValue }));
      toast.success("Bot personality updated");
    } catch {
      toast.error("Failed to update bot personality");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setLogoUploading(true);

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
              toast.error("Failed to convert image to PNG");
              setLogoUploading(false);
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
              toast.error("Logo upload failed");
              setLogoUploading(false);
              return;
            }

            const { data: urlData } = supabaseClient.storage
              .from("business")
              .getPublicUrl(filePath);

            setBusiness((prev) => ({
              ...prev,
              logoUrl: urlData.publicUrl,
            }));

            toast.success("Logo uploaded successfully");
            setLogoUploading(false);
          },
          "image/png",
          1.0
        );
      };

      image.onerror = () => {
        toast.error("Failed to load image. Please try another file.");
        setLogoUploading(false);
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
          {logoUploading ? (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-[var(--button)] bg-white">
              <div className="w-6 h-6 border-4 border-[var(--button)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <img
              src={business.logoUrl}
              alt="Business Logo"
              className="w-24 h-24 object-contain rounded-full border-4 border-[var(--button)]"
            />
          )}
          <label className="absolute bottom-0 right-0 bg-[var(--button)] p-1 rounded-full cursor-pointer hover:bg-[var(--button-hover)]">
            <Pencil size={14} className="text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-1 mb-2">
          <EditableBusinessField
            label=""
            value={business.name}
            type="text"
            icon={<Star size={16} />}
            validate={(v) => (!v ? "Business name cannot be empty" : "")}
            highlight={true}
            onSave={handleBusinessNameUpdate}
          />
        </div>

        <p className="text-sm text-gray-600 capitalize">
          {business.business_type}
        </p>

        <div className="mt-6 flex flex-col items-center space-y-3 w-full">
          {hasMenu ? (
            <button
              onClick={() =>
                (window.location.href = `/dashboard/business/${businessID}/menu`)
              }
              className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition shadow w-full"
            >
              <div className="flex flex-row justify-center items-center space-x-2">
                <List/>
                <span>View Menu Items</span>
              </div>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-yellow-700 flex items-center gap-1">
                <AlertTriangle size={16} /> No Menu Added
              </p>
              <button
                onClick={() =>
                  (window.location.href = `/dashboard/business/${businessID}/menu`)
                }
                className="text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition shadow"
              >
                + Add Menu Items
              </button>
            </div>
          )}

          <button
            onClick={() =>
              navigate(`/dashboard/business/${businessID}/menu-upload`)
            }
            className="px-5 py-2 rounded-full text-white font-semibold bg-[var(--button)] hover:bg-[var(--button-hover)] transition shadow w-full"
          >
            <div className="flex flex-row justify-center items-center space-x-2">
              <img
                src={MenuIcon}
                alt="menu icon"
                className="w-5 h-5 object-contain"
              />
              <span>View Menu Copy</span>
            </div>
          </button>
        </div>
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
                Are you sure you want to delete <strong>{business.name}</strong>
                ?
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
            onSave={handlePhoneNumberUpdate}
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
            onSave={handleOpeningTimeUpdate}
          />
          <EditableBusinessField
            label="Closing Time"
            value={business.closing_time?.slice(0, 5)}
            icon={<Clock size={16} />}
            type="time"
            onSave={handleClosingTimeUpdate}
          />
          <EditableBusinessField
            label="Ownership Tags"
            value={business.ownership_tags || []}
            icon={<Tags size={16} />}
            type="tags"
            onSave={handleBusinessTagsUpdate}
          />
          <EditableBusinessField
            label="Bot Personality"
            value={business.bot_personality}
            icon={<Smile size={16} />}
            type="select"
            options={["friendly", "professional", "funny"]}
            validate={(v) => (!v ? "Please select a personality" : "")}
            onSave={handleBotPersonalityUpdate}
          />
          <EditableBusinessField
            label="Bot Name"
            value={business.bot_name}
            icon={<Bot size={16} />}
            type="text"
            validate={(v) => (!v ? "Bot name cannot be empty" : "")}
            onSave={handleBotNameUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default BusinessDetails;
