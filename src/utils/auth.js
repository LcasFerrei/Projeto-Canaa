import { apiFetch, getToken, setToken, clearToken } from "./apiClient";

const ADMIN_EMAIL = "ernanedejesus@unifor.br";

export function isAuthenticated() {
  return !!getToken();
}

export async function login(email, password) {
  try {
    const { token } = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function logout() {
  try {
    await apiFetch("/api/logout", { method: "POST" });
  } catch {
    /* ignore network errors on logout */
  }
  clearToken();
}

export function getAdminEmail() {
  return ADMIN_EMAIL;
}

export async function changePassword(currentPassword, newPassword) {
  try {
    await apiFetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getSecurityQuestion() {
  try {
    const { question } = await apiFetch("/api/security-question");
    return question;
  } catch {
    return null;
  }
}

export async function setSecurityQuestion(question, answer) {
  await apiFetch("/api/security-question", {
    method: "PUT",
    body: JSON.stringify({ question, answer }),
  });
}

export async function verifySecurityAnswer(answer) {
  try {
    const { valid } = await apiFetch("/api/verify-security-answer", {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
    return valid;
  } catch {
    return false;
  }
}

export async function resetPassword(answer, newPassword) {
  await apiFetch("/api/reset-password", {
    method: "POST",
    body: JSON.stringify({ answer, newPassword }),
  });
}
