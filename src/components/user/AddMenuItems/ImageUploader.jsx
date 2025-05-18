import { useState, useRef } from "react";
import { XCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import { insertMenuItem } from "../../../supabase-utils/InsertMenuService";

function ImageUploader({ imageUploaderTitle, businessID, onItemAdded, businessType }) {
  const [uploads, setUploads] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);
  const [itemsAddedCount, setItemsAddedCount] = useState(null);
  const [dbStatus, setDbStatus] = useState("");
  const fileInputRef = useRef(null);
  const MAX_SIZE_MB = 5;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const updatedUploads = files.map((file) => {
      const isTooLarge = file.size > MAX_SIZE_MB * 1024 * 1024;
      return {
        name: file.name,
        file,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2),
        progress: isTooLarge ? 0 : Math.floor(Math.random() * 40) + 60,
        error: isTooLarge ? "File size is too large" : null,
        completed: !isTooLarge && Math.random() > 0.3,
      };
    });

    setUploads((prev) => [...prev, ...updatedUploads]);
    e.target.value = "";
  };

  const removeFile = (name) => {
    setUploads((prev) => prev.filter((file) => file.name !== name));
  };

  const generateMenuByAI = async () => {
    setGenerating(true);
    setExtractionDone(false);
    setItemsAddedCount(null);
    setDbStatus("");
  
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();
  
    if (sessionError || !sessionData?.session?.user?.id) {
      console.error("User not authenticated");
      return;
    }
  
    const userId = sessionData.session.user.id;
    let totalItemsAdded = 0;
  
    for (const upload of uploads) {
      const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
  
      const base64 = await fileToBase64(upload.file);
      const edgeFunction = `gemini-${businessType}-menu-generation`;
  
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${edgeFunction}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (await supabaseClient.auth.getSession()).data?.session?.access_token
            }`,
          },
          body: JSON.stringify({
            base64,
            mimeType: upload.file.type,
          }),
        }
      );
  
      const result = await response.json();
      setExtractionDone(true);
  
      for (const call of result) {
        try {
          await insertMenuItem(call.arguments, userId, businessID, businessType);
          totalItemsAdded++;
        } catch (err) {
          console.error("Insert failed:", err.message);
          setDbStatus("❌ Some inserts failed");
        }
      }
    }
  
    setItemsAddedCount(totalItemsAdded);
    setDbStatus("✅ Items successfully added to DB");
    setGenerating(false);
    if (onItemAdded) onItemAdded();
  };

  return (
    <div className="w-full h-full max-w-lg p-6 bg-white border border-gray-200 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {imageUploaderTitle || "Upload Menu Image"}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload a photo of your menu and let AI extract the items.
      </p>

      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center bg-gray-50 mb-4">
        <p className="text-gray-500 mb-2">Drag and drop files here</p>
        <p className="text-gray-400 mb-2">– OR –</p>
        <label className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md cursor-pointer hover:bg-blue-200">
          Browse Files
          <input
            type="file"
            multiple
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-3">
          {uploads.map((file) => (
            <div
              key={file.name + file.url}
              className={`flex items-center justify-between border p-3 rounded-md ${
                file.error
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {file.name}
                  </p>
                  {file.error ? (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {file.error}
                    </p>
                  ) : (
                    <div className="w-full bg-gray-200 rounded h-1.5 mt-1">
                      <div
                        className="bg-green-500 h-1.5 rounded"
                        style={{
                          width: `${file.completed ? 100 : file.progress}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.completed && !file.error && (
                  <CheckCircle className="text-green-500 w-5 h-5" />
                )}
                <button onClick={() => removeFile(file.name)} title="Remove">
                  <XCircle className="text-gray-400 hover:text-red-500 w-5 h-5 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status and Add Button */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-3">
          {!generating && (
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white font-semibold px-4 py-2 rounded shadow"
                onClick={generateMenuByAI}
              >
                Add Menu
              </button>
            </div>
          )}

          {generating && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />{" "}
              Extracting menu items using AI...
            </div>
          )}

          {extractionDone && (
            <div className="text-sm text-green-600 font-medium">
              ✅ Menu items extracted from image.
            </div>
          )}

          {itemsAddedCount !== null && (
            <div className="text-sm text-blue-600 font-medium">
              {itemsAddedCount} item(s) added to menu.
            </div>
          )}

          {dbStatus && (
            <div className="text-sm text-green-600 font-medium">{dbStatus}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
