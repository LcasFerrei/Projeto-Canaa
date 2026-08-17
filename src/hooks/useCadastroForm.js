import { useEffect, useState } from "react";
import { loadDraft, saveDraft, clearDraft, addRecord } from "../utils/storage";
import { loadSchema } from "../utils/formSchemaStorage";
import { validateFields } from "../utils/formValidation";

function buildEmptyFormData(schema) {
  const data = {};
  schema.steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.type === "photo") data[field.id] = null;
      else if (field.type === "children-list") data[field.id] = [""];
      else data[field.id] = "";
    });
  });
  return data;
}

export function useCadastroForm() {
  const [schema, setSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => loadDraft() ?? {});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadSchema().then((s) => {
      if (cancelled) return;
      setSchema(s);
      setLoadingSchema(false);
      setFormData((prev) => (Object.keys(prev).length ? prev : buildEmptyFormData(s)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stepCount = schema?.steps.length ?? 0;

  useEffect(() => {
    if (!submitted && Object.keys(formData).length) saveDraft(formData);
  }, [formData, submitted]);

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function updateFilho(index, value) {
    setFormData((prev) => {
      const filhos = [...(prev.filhosCongregam || [])];
      filhos[index] = value;
      return { ...prev, filhosCongregam: filhos };
    });
  }

  function addFilho() {
    setFormData((prev) => ({ ...prev, filhosCongregam: [...(prev.filhosCongregam || []), ""] }));
  }

  function removeFilho(index) {
    setFormData((prev) => ({
      ...prev,
      filhosCongregam: (prev.filhosCongregam || []).filter((_, i) => i !== index),
    }));
  }

  function validateStep(current) {
    const stepDef = schema.steps[current - 1];
    const nextErrors = validateFields(stepDef.fields, formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm() {
    if (!validateStep(step)) return false;
    setSubmitting(true);
    setSubmitError("");
    try {
      await addRecord(formData);
      clearDraft();
      setSubmitted(true);
      return true;
    } catch (err) {
      setSubmitError(err.message || "Não foi possível enviar. Tente novamente.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function goNext() {
    if (!validateStep(step)) return false;
    if (step < stepCount) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }
    return submitForm();
  }

  function goBack() {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetForm() {
    setFormData(schema ? buildEmptyFormData(schema) : {});
    setErrors({});
    setStep(1);
    setSubmitted(false);
    setSubmitError("");
    clearDraft();
  }

  return {
    schema,
    loadingSchema,
    stepCount,
    step,
    formData,
    errors,
    submitted,
    submitting,
    submitError,
    updateField,
    updateFilho,
    addFilho,
    removeFilho,
    goNext,
    goBack,
    resetForm,
  };
}
