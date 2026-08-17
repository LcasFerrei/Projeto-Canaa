export const ADMIN_EMAIL = "ernanedejesus@unifor.br";
export const DEFAULT_PASSWORD = "ernanedejesus@unifor.br";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export async function createSession(kv) {
  const token = crypto.randomUUID();
  await kv.put(`session:${token}`, "1", { expirationTtl: SESSION_TTL_SECONDS });
  return token;
}

export async function verifySession(kv, token) {
  if (!token) return false;
  const value = await kv.get(`session:${token}`);
  return value === "1";
}

export async function deleteSession(kv, token) {
  if (!token) return;
  await kv.delete(`session:${token}`);
}

export function getBearerToken(request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
}
