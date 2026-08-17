export default function RadioGroup({ label, name, value, onChange, options, error }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-bold text-canaa-blue">{label}</span>}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-canaa-blue"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(name, e.target.value)}
              className="h-4 w-4"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
}
