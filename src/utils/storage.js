const DRAFT_KEY = "canaa_cadastro_draft";
const RECORDS_KEY = "canaa_cadastros";

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

export function loadRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecord(data) {
  const records = loadRecords();
  const record = {
    ...data,
    id: crypto.randomUUID(),
    enviadoEm: new Date().toISOString(),
  };
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return record;
}

export function deleteRecord(id) {
  const records = loadRecords().filter((r) => r.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function replaceAllRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function updateRecord(id, patch) {
  const records = loadRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const updated = { ...records[index], ...patch, atualizadoEm: new Date().toISOString() };
  records[index] = updated;
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return updated;
}
