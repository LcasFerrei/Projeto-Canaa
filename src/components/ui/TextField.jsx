export default function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  required,
  multiline = false,
  rows = 3,
}) {
  const sharedClassName = `w-full rounded-md border bg-canaa-white px-3 py-2.5 text-sm text-slate-800
    shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70
    ${error ? "border-red-400" : "border-canaa-light"}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-canaa-blue">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={Boolean(error)}
          className={`${sharedClassName} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={Boolean(error)}
          className={sharedClassName}
        />
      )}
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
      {required === false && (
        <span className="text-[11px] text-slate-500">Opcional</span>
      )}
    </div>
  );
}
