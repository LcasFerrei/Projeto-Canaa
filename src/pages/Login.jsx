import { useState } from "react";
import logo from "../assets/canaa-logo.png";
import { login, getSecurityQuestion, verifySecurityAnswer, resetPassword } from "../utils/auth";

const fieldClass =
  "w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800 " +
  "shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70";

function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={props.id} className="text-sm font-bold text-canaa-light">
        {label}
      </label>
      <input {...props} className={fieldClass} />
    </div>
  );
}

export default function Login({ onSuccess }) {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [securityQuestion, setSecurityQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerVerified, setAnswerVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [info, setInfo] = useState("");

  function resetRecoveryState() {
    setAnswer("");
    setAnswerVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setInfo("");
  }

  function goToLogin() {
    resetRecoveryState();
    setView("login");
  }

  function goToForgot() {
    resetRecoveryState();
    setView("forgot");
    setLoadingQuestion(true);
    getSecurityQuestion().then((q) => {
      setSecurityQuestion(q);
      setLoadingQuestion(false);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) {
      setError("");
      onSuccess();
    } else {
      setError("E-mail ou senha incorretos.");
    }
  }

  async function handleVerifyAnswer(e) {
    e.preventDefault();
    setBusy(true);
    const ok = await verifySecurityAnswer(answer);
    setBusy(false);
    if (ok) {
      setError("");
      setAnswerVerified(true);
    } else {
      setError("Resposta incorreta.");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError("A nova senha precisa ter pelo menos 4 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(answer, newPassword);
      setAnswerVerified(false);
      setAnswer("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setInfo("Senha redefinida com sucesso! Faça login com a nova senha.");
      setView("login");
    } catch (err) {
      setError(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000c47] p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-canaa-dark p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
        <img src={logo} alt="Ministério Canaã" className="h-10 w-auto" />

        {view === "login" && (
          <>
            <div className="text-center">
              <h1 className="text-lg font-extrabold uppercase text-white">Área Administrativa</h1>
              <p className="mt-1 text-xs text-canaa-light">Acesso restrito · Canaã Lagoa Redonda</p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              <Field
                id="email"
                label="E-mail"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                id="password"
                label="Senha"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {info && <p className="text-xs font-semibold text-emerald-300">{info}</p>}
              {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-canaa-blue py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
              >
                {busy ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={goToForgot}
                className="text-center text-xs font-semibold text-canaa-light hover:text-white hover:underline"
              >
                Esqueci a senha
              </button>
            </form>
          </>
        )}

        {view === "forgot" && (
          <>
            <div className="text-center">
              <h1 className="text-lg font-extrabold uppercase text-white">Recuperar senha</h1>
              <p className="mt-1 text-xs text-canaa-light">Canaã Lagoa Redonda</p>
            </div>

            {loadingQuestion ? (
              <p className="text-sm text-canaa-light">Carregando...</p>
            ) : !securityQuestion ? (
              <div className="flex w-full flex-col gap-4 text-center">
                <p className="text-sm text-canaa-light">
                  Nenhuma pergunta de segurança foi configurada ainda. Entre com a senha atual e
                  configure uma em Configurações, ou fale com quem configurou o sistema.
                </p>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="w-full rounded-xl bg-canaa-blue py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  Voltar ao login
                </button>
              </div>
            ) : !answerVerified ? (
              <form onSubmit={handleVerifyAnswer} className="flex w-full flex-col gap-4">
                <Field
                  id="answer"
                  label={securityQuestion}
                  type="text"
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-canaa-blue py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Verificando..." : "Verificar resposta"}
                </button>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="text-center text-xs font-semibold text-canaa-light hover:text-white hover:underline"
                >
                  ‹ Voltar ao login
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="flex w-full flex-col gap-4">
                <Field
                  id="newPassword"
                  label="Nova senha"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Field
                  id="confirmPassword"
                  label="Confirmar nova senha"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-canaa-blue py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Salvando..." : "Salvar nova senha"}
                </button>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="text-center text-xs font-semibold text-canaa-light hover:text-white hover:underline"
                >
                  ‹ Voltar ao login
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
