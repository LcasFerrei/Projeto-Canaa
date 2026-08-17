export function isFieldEmpty(field, value) {
  if (field.type === "children-list" || field.type === "photo") return false;
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || String(value).trim() === "";
}

export function validateFields(fields, formData) {
  const errors = {};
  fields.forEach((field) => {
    if (field.required && isFieldEmpty(field, formData[field.id])) {
      errors[field.id] = field.type === "radio" ? "Selecione uma opção" : `${field.label} é obrigatório`;
    }
  });
  return errors;
}
