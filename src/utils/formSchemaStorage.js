import { apiFetch } from "./apiClient";
import { DEFAULT_SCHEMA } from "../config/formSchema";

export async function loadSchema() {
  try {
    const schema = await apiFetch("/api/schema");
    if (!Array.isArray(schema?.steps)) return DEFAULT_SCHEMA;
    return schema;
  } catch {
    return DEFAULT_SCHEMA;
  }
}

export async function saveSchema(schema) {
  await apiFetch("/api/schema", { method: "PUT", body: JSON.stringify(schema) });
}

export async function resetSchema() {
  return apiFetch("/api/schema", { method: "DELETE" });
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
