import { X } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps {
  image: string | null;
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (image) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 lightbox-overlay z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={image}
          alt="Gallery image"
          className="max-w-full max-h-full object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
