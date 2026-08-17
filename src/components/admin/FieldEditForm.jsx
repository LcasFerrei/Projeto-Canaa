import { useState } from "react";
import { FIELD_TYPES } from "../../config/formSchema";
import OptionsEditor from "./OptionsEditor";

const ADDABLE_TYPES = ["text", "textarea", "number", "tel", "date", "radio"];

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 " +
  "shadow-sm outline-none focus:ring-2 focus:ring-canaa-light";

export default function FieldEditForm({ initial, allowTypeChange = true, onSave, onCancel }) {
  const [label, setLabel] = useState(initial.label || "");
  const [type, setType] = useState(initial.type || "text");
  const [required, setRequired] = useState(!!initial.required);
  const [placeholder, setPlaceholder] = useState(initial.placeholder || "");
  const [options, setOptions] = useState(
    initial.options?.length ? initial.options : [{ value: "opcao1", label: "" }]
  );

  const isTextLike = ["text", "textarea", "number", "tel"].includes(type);
  const isRadio = type === "radio";

  function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    const patch = { label: label.trim(), type, required };
    if (isTextLike) patch.placeholder = placeholder.trim();
    if (isRadio) patch.options = options.filter((o) => o.label.trim());
    if (isRadio && patch.options.length === 0) return;
    onSave(patch);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase text-slate-500">Pergunta / rótulo</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-slate-500">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!allowTypeChange}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
          >
            {allowTypeChange ? (
              ADDABLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {FIELD_TYPES[t].label}
                </option>
              ))
            ) : (
              <option value={type}>{FIELD_TYPES[type]?.label || type}</option>
            )}
          </select>
        </div>

        <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="h-4 w-4"
          />
          Obrigatório
        </label>
      </div>

      {isTextLike && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-slate-500">
            Texto de exemplo (opcional)
          </label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      {isRadio && <OptionsEditor options={options} onChange={setOptions} />}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-canaa-blue px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110"
        >
          Salvar campo
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
