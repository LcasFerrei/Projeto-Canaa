import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/canaa-logo.png";
import Login from "./Login";
import { isAuthenticated } from "../utils/auth";
import { loadSchema, saveSchema, resetSchema, slugifyFieldId } from "../utils/formSchemaStorage";
import { PROTECTED_FIELD_IDS } from "../config/formSchema";
import FormFieldRow from "../components/admin/FormFieldRow";
import FieldEditForm from "../components/admin/FieldEditForm";
import LockIcon from "../components/ui/LockIcon";

export default function AdminFormBuilder() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [schema, setSchema] = useState(() => loadSchema());
  const [addingToStep, setAddingToStep] = useState(null);

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  function commit(nextSchema) {
    setSchema(nextSchema);
    saveSchema(nextSchema);
  }

  function updateStepTitle(stepId, title) {
    commit({
      steps: schema.steps.map((s) => (s.id === stepId ? { ...s, title } : s)),
    });
  }

  function updateFieldInStep(stepId, fieldId, patch) {
    commit({
      steps: schema.steps.map((s) =>
        s.id !== stepId
          ? s
          : { ...s, fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)) }
      ),
    });
  }

  function removeFieldFromStep(stepId, fieldId) {
    if (PROTECTED_FIELD_IDS.has(fieldId)) return;
    if (!confirm("Remover este campo do formulário?")) return;
    commit({
      steps: schema.steps.map((s) =>
        s.id !== stepId ? s : { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
      ),
    });
  }

  function moveFieldInStep(stepId, fieldId, direction) {
    commit({
      steps: schema.steps.map((s) => {
        if (s.id !== stepId) return s;
        const idx = s.fields.findIndex((f) => f.id === fieldId);
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= s.fields.length) return s;
        const fields = s.fields.slice();
        [fields[idx], fields[newIdx]] = [fields[newIdx], fields[idx]];
        return { ...s, fields };
      }),
    });
  }

  function addFieldToStep(stepId, patch) {
    const existingIds = new Set(schema.steps.flatMap((s) => s.fields.map((f) => f.id)));
    const id = slugifyFieldId(patch.label, existingIds);
    commit({
      steps: schema.steps.map((s) =>
        s.id !== stepId ? s : { ...s, fields: [...s.fields, { id, ...patch }] }
      ),
    });
    setAddingToStep(null);
  }

  function handleReset() {
    if (!confirm("Isso vai restaurar o formulário para o padrão original, desfazendo todas as alterações. Continuar?"))
      return;
    resetSchema();
    setSchema(loadSchema());
    setAddingToStep(null);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative flex flex-col items-center gap-3 bg-canaa-dark px-5 py-5 sm:px-8">
        <img
          src={logo}
          alt="Ministério Canaã"
          className="h-9 w-auto self-start sm:absolute sm:left-8 sm:top-1/2 sm:-translate-y-1/2"
        />
        <div className="text-center">
          <h1 className="text-base font-extrabold uppercase text-white sm:text-lg">
            Editor do Formulário
          </h1>
          <p className="text-xs text-canaa-light">Área Administrativa · Canaã Lagoa Redonda</p>
        </div>
        <Link
          to="/admin/configuracoes"
          className="self-end text-xs font-semibold text-canaa-light hover:text-white sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2"
        >
          ‹ Voltar às configurações
        </Link>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-6 sm:px-8">
        <div className="rounded-xl border border-canaa-light/60 bg-canaa-bg p-4 text-sm text-canaa-blue">
          Aqui você edita as perguntas que os fiéis respondem no cadastro. Campos com{" "}
          <LockIcon className="inline h-3.5 w-3.5 -translate-y-0.5" /> são usados pelo painel (abas
          de Casados, Com filhos, etc.) e não podem ser removidos, mas o texto e as opções deles
          podem ser editados livremente.
        </div>

        {schema.steps.map((step) => (
          <div key={step.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <textarea
              value={step.title}
              onChange={(e) => updateStepTitle(step.id, e.target.value)}
              rows={step.title.includes("\n") ? 2 : 1}
              className="mb-4 w-full resize-none rounded-md border border-transparent bg-transparent px-1 py-1 text-sm font-extrabold uppercase tracking-wide text-canaa-blue outline-none hover:border-slate-200 focus:border-canaa-light focus:bg-white"
            />

            <div className="flex flex-col gap-2">
              {step.fields.map((field, i) => (
                <FormFieldRow
                  key={field.id}
                  field={field}
                  isFirst={i === 0}
                  isLast={i === step.fields.length - 1}
                  onEdit={(patch) => updateFieldInStep(step.id, field.id, patch)}
                  onRemove={() => removeFieldFromStep(step.id, field.id)}
                  onMove={(dir) => moveFieldInStep(step.id, field.id, dir)}
                />
              ))}
            </div>

            {addingToStep === step.id ? (
              <div className="mt-3">
                <FieldEditForm
                  initial={{ type: "text" }}
                  onSave={(patch) => addFieldToStep(step.id, patch)}
                  onCancel={() => setAddingToStep(null)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingToStep(step.id)}
                className="mt-3 flex items-center gap-1.5 text-sm font-bold text-canaa-blue hover:underline"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canaa-blue text-xs text-white">
                  +
                </span>
                Adicionar campo
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-col items-start gap-2 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
          >
            Restaurar formulário padrão
          </button>
          <p className="text-xs text-slate-500">
            Isso desfaz todas as personalizações e volta o formulário ao original.
          </p>
        </div>
      </main>
    </div>
  );
}
