const AUTH_KEY = "canaa_admin_auth";
const PASSWORD_KEY = "canaa_admin_password";
const SECURITY_KEY = "canaa_admin_security";

const ADMIN_EMAIL = "ernanedejesus@unifor.br";
const DEFAULT_PASSWORD = "ernanedejesus@unifor.br";

function getStoredPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

export function login(email, password) {
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === getStoredPassword();
  if (ok) localStorage.setItem(AUTH_KEY, "1");
  return ok;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function getAdminEmail() {
  return ADMIN_EMAIL;
}

export function changePassword(currentPassword, newPassword) {
  if (currentPassword !== getStoredPassword()) return false;
  localStorage.setItem(PASSWORD_KEY, newPassword);
  return true;
}

export function getSecurityQuestion() {
  try {
    const raw = localStorage.getItem(SECURITY_KEY);
    return raw ? JSON.parse(raw).question : null;
  } catch {
    return null;
  }
}

export function setSecurityQuestion(question, answer) {
  let finalAnswer = answer.trim().toLowerCase();
  if (!finalAnswer) {
    try {
      const raw = localStorage.getItem(SECURITY_KEY);
      finalAnswer = raw ? JSON.parse(raw).answer : "";
    } catch {
      finalAnswer = "";
    }
  }
  localStorage.setItem(SECURITY_KEY, JSON.stringify({ question: question.trim(), answer: finalAnswer }));
}

export function verifySecurityAnswer(answer) {
  try {
    const raw = localStorage.getItem(SECURITY_KEY);
    if (!raw) return false;
    const stored = JSON.parse(raw);
    return stored.answer === answer.trim().toLowerCase();
  } catch {
    return false;
  }
}

export function resetPassword(newPassword) {
  localStorage.setItem(PASSWORD_KEY, newPassword);
}
