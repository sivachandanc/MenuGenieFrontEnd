import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import toast from "react-hot-toast";

function UploadMenuCopy() {
  const { businessID } = useParams();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const fetchFiles = async () => {
    const { data, error } = await supabaseClient.storage
      .from("business")
      .list(`business_menu/${businessID}/`);
    if (error) toast.error("Failed to fetch uploaded menu files.");
    else setExistingFiles(data || []);
  };

  useEffect(() => {
    fetchFiles();
  }, [businessID]);

  const convertToJpegBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.9
          );
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    const total = existingFiles.length + selected.length;
    if (total > 10) {
      toast.error("You can upload up to 10 menu images only.");
      return;
    }

    setUploading(true);
    let index = existingFiles.length + 1;

    for (let file of selected) {
      const jpegBlob = await convertToJpegBlob(file);
      const filename = `menu_${index++}.jpeg`;

      const { error } = await supabaseClient.storage
        .from("business")
        .upload(`business_menu/${businessID}/${filename}`, jpegBlob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) toast.error(`Failed to upload ${file.name}`);
      else toast.success(`Uploaded ${filename}`);
    }

    setUploading(false);
    fetchFiles();
  };

  const handleDelete = async (filename) => {
    setDeleting(filename);
    const { error } = await supabaseClient.storage
      .from("business")
      .remove([`business_menu/${businessID}/${filename}`]);

    if (error) toast.error("Failed to delete image.");
    else {
      toast.success("Image deleted.");
      await fetchFiles();
    }
    setDeleting(null);
  };

  // Cache-busting public URL generator
  const publicUrl = (filename) =>
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/business/business_menu/${businessID}/${filename}?t=${Date.now()}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Manage Menu Copies
      </h1>
      <p className="text-sm text-gray-500 mb-3">
        Upload actual menu images or scans. You can upload up to 10 images.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
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
        <p className="mt-4 text-xs text-gray-500">
          💡 To update a menu, just delete and re-upload it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {existingFiles.map((file) => (
          <div
            key={file.name}
            className="relative rounded-xl overflow-hidden border bg-white shadow-md group"
          >
            {deleting === file.name && (
              <div className="absolute inset-0 bg-white bg-opacity-60 z-20 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.name);
                }}
                className="w-9 h-9 flex items-center justify-center bg-white text-red-600 hover:bg-red-100 rounded-full shadow"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div
              className="cursor-pointer"
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
          </div>
        ))}
      </div>

      {modalImage && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
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
