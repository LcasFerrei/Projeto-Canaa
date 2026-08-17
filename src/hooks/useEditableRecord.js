import { useState } from "react";
import { loadSchema } from "../utils/formSchemaStorage";
import { validateFields } from "../utils/formValidation";

export function useEditableRecord(record) {
  const [schema] = useState(() => loadSchema());
  const [formData, setFormData] = useState(() => ({
    ...record,
    filhosCongregam: record.filhosCongregam?.length ? record.filhosCongregam : [""],
    observacoesInternas: record.observacoesInternas ?? "",
  }));
  const [errors, setErrors] = useState({});

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function updateFilho(index, value) {
    setFormData((prev) => {
      const filhos = [...prev.filhosCongregam];
      filhos[index] = value;
      return { ...prev, filhosCongregam: filhos };
    });
  }

  function addFilho() {
    setFormData((prev) => ({ ...prev, filhosCongregam: [...prev.filhosCongregam, ""] }));
  }

  function removeFilho(index) {
    setFormData((prev) => ({
      ...prev,
      filhosCongregam: prev.filhosCongregam.filter((_, i) => i !== index),
    }));
  }

  function validate() {
    const allFields = schema.steps.flatMap((s) => s.fields);
    const nextErrors = validateFields(allFields, formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return { formData, errors, updateField, updateFilho, addFilho, removeFilho, validate };
}
