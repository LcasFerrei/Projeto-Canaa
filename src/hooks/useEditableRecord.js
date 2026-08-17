import { useEffect, useState } from "react";
import { loadSchema } from "../utils/formSchemaStorage";
import { validateFields } from "../utils/formValidation";

export function useEditableRecord(record) {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState(() => ({
    ...record,
    filhosCongregam: record.filhosCongregam?.length ? record.filhosCongregam : [""],
    observacoesInternas: record.observacoesInternas ?? "",
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadSchema().then((s) => {
      if (!cancelled) setSchema(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    if (!schema) return false;
    const allFields = schema.steps.flatMap((s) => s.fields);
    const nextErrors = validateFields(allFields, formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return { schema, formData, errors, updateField, updateFilho, addFilho, removeFilho, validate };
}
