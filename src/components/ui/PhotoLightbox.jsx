export default function PhotoLightbox({ src, onClose, onChangePhoto }) {
  return (
    <div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
      >
        ✕
      </button>

      <img
        src={src}
        alt="Foto ampliada"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
      />

      {onChangePhoto && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChangePhoto();
          }}
          className="mt-6 rounded-xl bg-canaa-blue px-6 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110"
        >
          Trocar foto
        </button>
      )}
    </div>
  );
}
