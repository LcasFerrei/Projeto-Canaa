import { useRef, useState } from "react";
import PhotoCropModal from "./PhotoCropModal";
import PhotoLightbox from "./PhotoLightbox";

export default function PhotoUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [rawImage, setRawImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  function openFilePicker(e) {
    e?.stopPropagation();
    inputRef.current?.click();
  }

  function handleCircleClick() {
    if (value) setShowLightbox(true);
    else openFilePicker();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleCropConfirm(croppedDataUrl) {
    onChange(croppedDataUrl);
    setRawImage(null);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <button
          type="button"
          onClick={handleCircleClick}
          className="flex h-full w-full items-center justify-center rounded-full border-2
            border-dashed border-canaa-blue/60 bg-canaa-light p-1"
        >
          {value ? (
            <img src={value} alt="Foto do membro" className="h-full w-full rounded-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-canaa-bg">
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={openFilePicker}
          aria-label="Trocar foto"
          className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-canaa-blue shadow-md"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
            <path
              d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
              fill="currentColor"
            />
            <circle cx="12" cy="13" r="3.2" fill="#004BFC" stroke="white" strokeWidth="1" />
          </svg>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <p className="text-center text-xs font-medium text-canaa-blue">
        {value ? "Toque na foto para ampliar · toque na câmera para trocar" : "Toque no círculo acima para adicionar sua foto"}
      </p>

      {rawImage && (
        <PhotoCropModal
          imageSrc={rawImage}
          onCancel={() => setRawImage(null)}
          onConfirm={handleCropConfirm}
        />
      )}

      {showLightbox && value && (
        <PhotoLightbox
          src={value}
          onClose={() => setShowLightbox(false)}
          onChangePhoto={() => {
            setShowLightbox(false);
            inputRef.current?.click();
          }}
        />
      )}
    </div>
  );
}
