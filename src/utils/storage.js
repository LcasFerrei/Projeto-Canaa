import { apiFetch } from "./apiClient";

const DRAFT_KEY = "canaa_cadastro_draft";

// Rascunho do formulário em preenchimento: fica só neste navegador mesmo,
// não faz sentido sincronizar entre dispositivos um cadastro incompleto.
export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

// Cadastros enviados: ficam no servidor (KV), compartilhados entre todos os
// navegadores/dispositivos.
export async function loadRecords() {
  return apiFetch("/api/records");
}

export async function addRecord(data) {
  return apiFetch("/api/records", { method: "POST", body: JSON.stringify(data) });
}

export async function updateRecord(id, patch) {
  return apiFetch(`/api/records/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}

export async function deleteRecord(id) {
  await apiFetch(`/api/records/${id}`, { method: "DELETE" });
}

export async function replaceAllRecords(records) {
  await apiFetch("/api/records", { method: "PUT", body: JSON.stringify(records) });
}
