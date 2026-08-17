import { DEFAULT_SCHEMA } from "../src/config/formSchema.js";
import * as store from "./kv.js";
import {
  ADMIN_EMAIL,
  DEFAULT_PASSWORD,
  createSession,
  verifySession,
  deleteSession,
  getBearerToken,
} from "./auth.js";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}

function unauthorized() {
  return json({ error: "Não autorizado" }, { status: 401 });
}

function notFound() {
  return json({ error: "Não encontrado" }, { status: 404 });
}

async function isAuthed(request, kv) {
  return verifySession(kv, getBearerToken(request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (!pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    const kv = env.CANAA_KV;

    try {
      // ---------- Auth ----------
      if (pathname === "/api/login" && request.method === "POST") {
        const { email, password } = await request.json();
        const storedPassword = await store.getPassword(kv, DEFAULT_PASSWORD);
        const ok =
          (email || "").trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          password === storedPassword;
        if (!ok) return json({ error: "E-mail ou senha incorretos." }, { status: 401 });
        const token = await createSession(kv);
        return json({ token });
      }

      if (pathname === "/api/logout" && request.method === "POST") {
        await deleteSession(kv, getBearerToken(request));
        return json({ ok: true });
      }

      if (pathname === "/api/session" && request.method === "GET") {
        return json({ authenticated: await isAuthed(request, kv) });
      }

      if (pathname === "/api/security-question" && request.method === "GET") {
        const sq = await store.getSecurityQuestion(kv);
        return json({ question: sq?.question || null });
      }

      if (pathname === "/api/security-question" && request.method === "PUT") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const { question, answer } = await request.json();
        if (!question || !question.trim()) return json({ error: "Informe a pergunta." }, { status: 400 });
        await store.setSecurityQuestion(kv, question, answer);
        return json({ ok: true });
      }

      if (pathname === "/api/verify-security-answer" && request.method === "POST") {
        const { answer } = await request.json();
        const sq = await store.getSecurityQuestion(kv);
        const ok = !!sq && sq.answer === (answer || "").trim().toLowerCase();
        return json({ valid: ok });
      }

      if (pathname === "/api/reset-password" && request.method === "POST") {
        const { answer, newPassword } = await request.json();
        const sq = await store.getSecurityQuestion(kv);
        const ok = !!sq && sq.answer === (answer || "").trim().toLowerCase();
        if (!ok) return json({ error: "Resposta incorreta." }, { status: 401 });
        if (!newPassword || newPassword.length < 4)
          return json({ error: "A nova senha precisa ter pelo menos 4 caracteres." }, { status: 400 });
        await store.setPassword(kv, newPassword);
        return json({ ok: true });
      }

      if (pathname === "/api/change-password" && request.method === "POST") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const { currentPassword, newPassword } = await request.json();
        const storedPassword = await store.getPassword(kv, DEFAULT_PASSWORD);
        if (currentPassword !== storedPassword)
          return json({ error: "Senha atual incorreta." }, { status: 400 });
        if (!newPassword || newPassword.length < 4)
          return json({ error: "A nova senha precisa ter pelo menos 4 caracteres." }, { status: 400 });
        await store.setPassword(kv, newPassword);
        return json({ ok: true });
      }

      // ---------- Schema ----------
      if (pathname === "/api/schema" && request.method === "GET") {
        return json(await store.getSchema(kv, DEFAULT_SCHEMA));
      }

      if (pathname === "/api/schema" && request.method === "PUT") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const schema = await request.json();
        if (!Array.isArray(schema?.steps)) return json({ error: "Schema inválido." }, { status: 400 });
        await store.saveSchema(kv, schema);
        return json({ ok: true });
      }

      if (pathname === "/api/schema" && request.method === "DELETE") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        await store.resetSchema(kv);
        return json(DEFAULT_SCHEMA);
      }

      // ---------- Records ----------
      if (pathname === "/api/records" && request.method === "POST") {
        const data = await request.json();
        const records = await store.getRecords(kv);
        const record = { ...data, id: crypto.randomUUID(), enviadoEm: new Date().toISOString() };
        records.push(record);
        await store.saveRecords(kv, records);
        return json(record, { status: 201 });
      }

      if (pathname === "/api/records" && request.method === "GET") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        return json(await store.getRecords(kv));
      }

      if (pathname === "/api/records" && request.method === "PUT") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const records = await request.json();
        if (!Array.isArray(records)) return json({ error: "Formato inválido." }, { status: 400 });
        await store.saveRecords(kv, records);
        return json({ ok: true });
      }

      const recordMatch = pathname.match(/^\/api\/records\/([^/]+)$/);
      if (recordMatch && request.method === "PUT") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const id = recordMatch[1];
        const patch = await request.json();
        const records = await store.getRecords(kv);
        const idx = records.findIndex((r) => r.id === id);
        if (idx === -1) return notFound();
        records[idx] = { ...records[idx], ...patch, id, atualizadoEm: new Date().toISOString() };
        await store.saveRecords(kv, records);
        return json(records[idx]);
      }

      if (recordMatch && request.method === "DELETE") {
        if (!(await isAuthed(request, kv))) return unauthorized();
        const id = recordMatch[1];
        const records = await store.getRecords(kv);
        await store.saveRecords(
          kv,
          records.filter((r) => r.id !== id)
        );
        return json({ ok: true });
      }

      return notFound();
    } catch (err) {
      return json({ error: err.message || "Erro interno." }, { status: 500 });
    }
  },
};
