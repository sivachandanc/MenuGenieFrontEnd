import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import toast from "react-hot-toast";

function UploadMenuCopy() {
  const { businessID } = useParams();
  const [uploading, setUploading] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [modalImage, setModalImage] = useState(null); // image URL for modal

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabaseClient.storage
        .from("business")
        .list(`business_menu/${businessID}/`);

      if (error) {
        toast.error("Failed to fetch uploaded menu files.");
      } else {
        setExistingFiles(data || []);
      }
    };

    fetchFiles();
  }, [businessID]);

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    const total = existingFiles.length + selected.length;

    if (total > 10) {
      toast.error("You can upload up to 10 menu images only.");
      return;
    }

    setUploading(true);

    for (let file of selected) {
      const { error } = await supabaseClient.storage
        .from("business")
        .upload(`business_menu/${businessID}/${file.name}`, file, { upsert: true });

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      } else {
        toast.success(`Uploaded ${file.name}`);
      }
    }

    setUploading(false);
    window.location.reload();
  };

  const publicUrl = (filename) =>
    `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/business/business_menu/${businessID}/${filename}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Manage Menu Copies
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Upload actual menu images or scans. You can upload up to 10 images.
      </p>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
        <p className="text-gray-600 font-medium mb-2">
          Drag and drop images here
        </p>
        <p className="text-sm text-gray-400 mb-4">Or</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className={`inline-block px-6 py-2 font-semibold rounded bg-[var(--button)] hover:bg-[var(--button-hover)] text-white cursor-pointer transition ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Select Files"}
        </label>
      </div>

      {/* Existing Files Grid */}
      {existingFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {existingFiles.map((file) => (
            <div
              key={file.name}
              className="rounded-xl overflow-hidden shadow bg-white cursor-pointer"
              onClick={() => setModalImage(publicUrl(file.name))}
            >
              <img
                src={publicUrl(file.name)}
                alt={file.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center mt-4">
          No menu copies uploaded yet.
        </p>
      )}

      {/* Fullscreen Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={modalImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full px-2 hover:bg-opacity-80"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadMenuCopy;
