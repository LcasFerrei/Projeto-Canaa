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
  const [schema] = useState(() => loadSchema());
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const draft = loadDraft();
    return draft ?? buildEmptyFormData(schema);
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const stepCount = schema.steps.length;

  useEffect(() => {
    if (!submitted) saveDraft(formData);
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

  function goNext() {
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

  function submitForm() {
    if (!validateStep(step)) return false;
    addRecord(formData);
    clearDraft();
    setSubmitted(true);
    return true;
  }

  function resetForm() {
    setFormData(buildEmptyFormData(schema));
    setErrors({});
    setStep(1);
    setSubmitted(false);
    clearDraft();
  }

  return {
    schema,
    stepCount,
    step,
    formData,
    errors,
    submitted,
    updateField,
    updateFilho,
    addFilho,
    removeFilho,
    goNext,
    goBack,
    resetForm,
  };
}
