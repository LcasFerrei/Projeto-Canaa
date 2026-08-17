import { slugifyFieldId } from "../../utils/formSchemaStorage";

export default function OptionsEditor({ options, onChange }) {
  function updateLabel(index, label) {
    const next = options.slice();
    next[index] = { ...next[index], label };
    onChange(next);
  }

  function removeOption(index) {
    onChange(options.filter((_, i) => i !== index));
  }

  function addOption() {
    const existingValues = new Set(options.map((o) => o.value));
    const value = slugifyFieldId(`opcao ${options.length + 1}`, existingValues);
    onChange([...options, { value, label: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase text-slate-500">Opções</span>
      {options.map((opt, i) => (
        <div key={opt.value} className="flex items-center gap-2">
          <input
            type="text"
            value={opt.label}
            onChange={(e) => updateLabel(i, e.target.value)}
            placeholder="Texto da opção"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
              shadow-sm outline-none focus:ring-2 focus:ring-canaa-light"
          />
          <button
            type="button"
            onClick={() => removeOption(i)}
            aria-label="Remover opção"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="w-fit text-xs font-bold text-canaa-blue hover:underline"
      >
        + Adicionar opção
      </button>
    </div>
  );
}
