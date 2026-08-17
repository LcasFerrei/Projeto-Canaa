export default function NextButton({ label = "Próximo", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-canaa-blue py-3.5
        text-sm font-bold text-canaa-white shadow-md transition hover:brightness-110 active:scale-[0.99] sm:text-base"
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
  );
}
