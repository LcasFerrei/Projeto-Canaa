export default function NextButton({ label = "Próximo", onClick, loading = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-canaa-blue py-3.5
        text-sm font-bold text-canaa-white shadow-md transition hover:brightness-110 active:scale-[0.99]
        disabled:opacity-70 sm:text-base"
    >
      {loading ? "Enviando..." : label}
      {!loading && <span aria-hidden="true">→</span>}
    </button>
  );
}
