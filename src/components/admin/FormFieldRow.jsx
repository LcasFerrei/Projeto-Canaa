import { useState } from "react";
import { FIELD_TYPES, PROTECTED_FIELD_IDS } from "../../config/formSchema";
import LockIcon from "../ui/LockIcon";
import FieldEditForm from "./FieldEditForm";

export default function FormFieldRow({ field, isFirst, isLast, onEdit, onRemove, onMove }) {
  const [editing, setEditing] = useState(false);
  const protectedField = PROTECTED_FIELD_IDS.has(field.id);
  const specialType = field.type === "photo" || field.type === "children-list";

  function handleSave(patch) {
    onEdit(patch);
    setEditing(false);
  }

  if (editing) {
    return (
      <FieldEditForm
        initial={field}
        allowTypeChange={!protectedField && !specialType}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-800">{field.label}</span>
          {protectedField && (
            <span title="Campo usado pelo painel administrativo — não pode ser removido">
              <LockIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold">
            {FIELD_TYPES[field.type]?.label || field.type}
          </span>
          {field.required && (
            <span className="rounded bg-canaa-bg px-1.5 py-0.5 font-semibold text-canaa-blue">
              Obrigatório
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={isFirst}
          aria-label="Mover para cima"
          className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={isLast}
          aria-label="Mover para baixo"
          className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded px-2 py-1 text-xs font-semibold text-canaa-blue hover:bg-canaa-bg"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={protectedField}
          title={protectedField ? "Este campo não pode ser removido" : "Remover campo"}
          className="rounded px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
