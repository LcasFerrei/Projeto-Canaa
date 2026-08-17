export default function ProgressBar({ step, total }) {
  const percent = (step / total) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-canaa-light">
        Passo {step} de {total}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-canaa-light transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
