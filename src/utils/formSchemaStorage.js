import { DEFAULT_SCHEMA } from "../config/formSchema";

const SCHEMA_KEY = "canaa_form_schema";

export function loadSchema() {
  try {
    const raw = localStorage.getItem(SCHEMA_KEY);
    if (!raw) return DEFAULT_SCHEMA;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.steps)) return DEFAULT_SCHEMA;
    return parsed;
  } catch {
    return DEFAULT_SCHEMA;
  }
}

export function saveSchema(schema) {
  localStorage.setItem(SCHEMA_KEY, JSON.stringify(schema));
}

export function resetSchema() {
  localStorage.removeItem(SCHEMA_KEY);
}

export function slugifyFieldId(label, existingIds) {
  const base =
    label
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .split(" ")
      .map((word, i) =>
        i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("") || "campo";

  let id = base;
  let suffix = 1;
  while (existingIds.has(id)) {
    id = `${base}${suffix}`;
    suffix += 1;
  }
  return id;
}
