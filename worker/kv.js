const RECORDS_KEY = "records";
const SCHEMA_KEY = "form_schema";
const PASSWORD_KEY = "admin_password";
const SECURITY_KEY = "security_question";

export async function getRecords(kv) {
  const raw = await kv.get(RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveRecords(kv, records) {
  await kv.put(RECORDS_KEY, JSON.stringify(records));
}

export async function getSchema(kv, defaultSchema) {
  const raw = await kv.get(SCHEMA_KEY);
  return raw ? JSON.parse(raw) : defaultSchema;
}

export async function saveSchema(kv, schema) {
  await kv.put(SCHEMA_KEY, JSON.stringify(schema));
}

export async function resetSchema(kv) {
  await kv.delete(SCHEMA_KEY);
}

export async function getPassword(kv, defaultPassword) {
  const stored = await kv.get(PASSWORD_KEY);
  return stored || defaultPassword;
}

export async function setPassword(kv, password) {
  await kv.put(PASSWORD_KEY, password);
}

export async function getSecurityQuestion(kv) {
  const raw = await kv.get(SECURITY_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setSecurityQuestion(kv, question, answer) {
  let finalAnswer = (answer || "").trim().toLowerCase();
  if (!finalAnswer) {
    const existing = await getSecurityQuestion(kv);
    finalAnswer = existing?.answer || "";
  }
  await kv.put(SECURITY_KEY, JSON.stringify({ question: question.trim(), answer: finalAnswer }));
}
