import { useState } from "react";
import { useEditableRecord } from "../../hooks/useEditableRecord";
import DynamicField from "../form/DynamicField";
import LockIcon from "../ui/LockIcon";

const WIDE_TYPES = new Set(["radio", "children-list", "textarea"]);

function Section({ title, children }) {
  return (
    <div className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-4 whitespace-pre-line text-xs font-extrabold uppercase tracking-wide text-canaa-blue/70">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">{children}</div>
    </div>
  );
}

export default function RecordEditModal({ record, onCancel, onSave, onDelete }) {
  const { schema, formData, errors, updateField, updateFilho, addFilho, removeFilho, validate } =
    useEditableRecord(record);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setSaveError("");
    try {
      await onSave(formData);
    } catch (err) {
      setSaveError(err.message || "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!confirm("Remover este cadastro? Essa ação não pode ser desfeita.")) return;
    onDelete(record.id);
  }

  if (!schema) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white px-8 py-6 text-sm font-semibold text-slate-500 shadow-xl">
          Carregando...
        </div>
      </div>
    );
  }

  const photoField = schema.steps.flatMap((s) => s.fields).find((f) => f.type === "photo");

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-black/50 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-extrabold text-canaa-dark">
            {record.nomeCompleto ? "Editar cadastro" : "Novo cadastro"}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-5">
          {photoField && (
            <DynamicField field={photoField} formData={formData} errors={errors} updateField={updateField} />
          )}

          {schema.steps.map((step) => {
            const fields = step.fields.filter((f) => f.type !== "photo");
            if (fields.length === 0) return null;
            return (
              <Section key={step.id} title={step.title}>
                {fields.map((field) => (
                  <div key={field.id} className={WIDE_TYPES.has(field.type) ? "lg:col-span-2" : undefined}>
                    <DynamicField
                      field={field}
                      formData={formData}
                      errors={errors}
                      updateField={updateField}
                      updateFilho={updateFilho}
                      addFilho={addFilho}
                      removeFilho={removeFilho}
                    />
                  </div>
                ))}
              </Section>
            );
          })}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <label htmlFor="observacoesInternas" className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-700">
              <LockIcon className="h-3.5 w-3.5" />
              Observações internas (só o admin vê)
            </label>
            <textarea
              id="observacoesInternas"
              name="observacoesInternas"
              rows={3}
              value={formData.observacoesInternas}
              onChange={(e) => updateField("observacoesInternas", e.target.value)}
              placeholder="Ex: está afastado, precisa de visita, serve na equipe de louvor..."
              className="w-full resize-y rounded-md border border-amber-300 bg-white px-3 py-2.5 text-sm text-slate-800
                shadow-sm outline-none transition focus:ring-2 focus:ring-amber-300"
            />
            <p className="mt-1 text-[11px] text-amber-700/80">
              Este campo não faz parte do formulário público — visível apenas aqui no painel.
            </p>
          </div>
        </div>

        {saveError && (
          <p className="border-t border-red-100 bg-red-50 px-6 py-2 text-xs font-semibold text-red-600">
            {saveError}
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row-reverse">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-canaa-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 sm:mr-auto"
          >
            Remover cadastro
          </button>
        </div>
      </div>
    </div>
  );
}
