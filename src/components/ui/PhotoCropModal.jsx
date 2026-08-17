import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";

export default function PhotoCropModal({ imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setSaving(true);
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    setSaving(false);
    onConfirm(cropped);
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-bold text-white">Ajustar foto</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-white/70 hover:text-white"
        >
          Cancelar
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/70" fill="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="0" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-canaa-light"
            aria-label="Zoom"
          />
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving}
          className="w-full rounded-xl bg-canaa-blue py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Usar esta foto"}
        </button>
      </div>
    </div>
  );
}
