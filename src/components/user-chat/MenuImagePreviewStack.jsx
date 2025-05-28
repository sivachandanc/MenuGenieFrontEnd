import { useState, useEffect } from "react";

function MenuImagePreviewStack({ menuImages = [], onClickPreview }) {
  const [previewLoaded, setPreviewLoaded] = useState(false);

  useEffect(() => {
    if (menuImages.length === 0) return;

    const img = new Image();
    img.src = menuImages[0];
    img.onload = () => setPreviewLoaded(true);
    img.onerror = () => setPreviewLoaded(true); // fail-safe
  }, [menuImages]);

  const offsets = [
    "rotate-[-2deg] translate-x-2 translate-y-1 z-10",
    "rotate-[2deg] translate-x-4 translate-y-2 z-0",
  ];

  return (
    <div className="relative w-fit mx-auto mt-6 h-64">
      {!previewLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div
        onClick={previewLoaded ? onClickPreview : null}
        className={`relative w-fit h-full cursor-pointer group ${
          !previewLoaded ? "pointer-events-none opacity-50" : ""
        }`}
        title="Tap to view menu"
      >
        {menuImages.slice(0, 2).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Menu ${i + 1}`}
            className={`w-48 h-auto rounded shadow-lg absolute top-0 left-0 transition-transform duration-200 ease-in-out group-hover:scale-105 ${offsets[i]}`}
          />
        ))}

        {/* Base layer placeholder */}
        <div className="w-48 h-64 rounded flex items-end justify-center pt-48">
          <p className="text-xs text-gray-500">Tap to view menu</p>
        </div>
      </div>
    </div>
  );
}

export default MenuImagePreviewStack;
