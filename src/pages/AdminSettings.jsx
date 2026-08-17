import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/canaa-logo.png";
import Login from "./Login";
import {
  isAuthenticated,
  getAdminEmail,
  getSecurityQuestion,
  setSecurityQuestion,
  changePassword,
} from "../utils/auth";

export default function AdminSettings() {
  const [authed, setAuthed] = useState(isAuthenticated());

  const [question, setQuestion] = useState(getSecurityQuestion() || "");
  const [answer, setAnswer] = useState("");
  const [questionMsg, setQuestionMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  function handleSaveQuestion(e) {
    e.preventDefault();
    if (!question.trim()) {
      setQuestionMsg("Preencha a pergunta.");
      return;
    }
    if (!answer.trim() && !getSecurityQuestion()) {
      setQuestionMsg("Preencha a resposta.");
      return;
    }
    setSecurityQuestion(question, answer);
    setAnswer("");
    setQuestionMsg("Pergunta de segurança salva com sucesso.");
  }

  function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMsg("");
    if (newPassword.length < 4) {
      setPasswordError("A nova senha precisa ter pelo menos 4 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    const ok = changePassword(currentPassword, newPassword);
    if (!ok) {
      setPasswordError("Senha atual incorreta.");
      return;
    }
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMsg("Senha alterada com sucesso.");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative flex flex-col items-center gap-3 bg-canaa-dark px-5 py-5 sm:px-8">
        <img
          src={logo}
          alt="Ministério Canaã"
          className="h-9 w-auto self-start sm:absolute sm:left-8 sm:top-1/2 sm:-translate-y-1/2"
        />
        <div className="text-center">
          <h1 className="text-base font-extrabold uppercase text-white sm:text-lg">Configurações</h1>
          <p className="text-xs text-canaa-light">Área Administrativa · Canaã Lagoa Redonda</p>
        </div>
        <Link
          to="/admin"
          className="self-end text-xs font-semibold text-canaa-light hover:text-white sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2"
        >
          ‹ Voltar ao painel
        </Link>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-6 sm:px-8">
        <Link
          to="/admin/configuracoes/formulario"
          className="flex items-center justify-between rounded-xl border border-canaa-light/60 bg-canaa-bg p-5 text-canaa-blue shadow-sm transition hover:brightness-95"
        >
          <span>
            <span className="block text-sm font-extrabold uppercase tracking-wide">
              Editar formulário de cadastro
            </span>
            <span className="mt-1 block text-xs text-canaa-blue/80">
              Adicione, edite, remova e reordene as perguntas que os fiéis respondem.
            </span>
          </span>
          <span aria-hidden="true">→</span>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-canaa-blue">Conta</h2>
          <p className="mt-2 text-sm text-slate-600">
            E-mail de acesso: <span className="font-semibold">{getAdminEmail()}</span>
          </p>
        </div>

        <form onSubmit={handleSaveQuestion} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-canaa-blue">
            Pergunta de segurança
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Usada na tela de login para recuperar a senha caso você esqueça.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="question" className="text-sm font-bold text-canaa-blue">
                Pergunta
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Qual o nome da minha primeira igreja?"
                className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800
                  shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="answer" className="text-sm font-bold text-canaa-blue">
                Resposta {getSecurityQuestion() && "(deixe em branco para manter a atual)"}
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Digite a resposta secreta"
                className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800
                  shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
              />
            </div>

            {questionMsg && <p className="text-xs font-semibold text-emerald-600">{questionMsg}</p>}

            <button
              type="submit"
              className="w-fit rounded-lg bg-canaa-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            >
              Salvar pergunta
            </button>
          </div>
        </form>

        <form onSubmit={handleChangePassword} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-canaa-blue">Alterar senha</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="currentPassword" className="text-sm font-bold text-canaa-blue">
                Senha atual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800
                  shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword2" className="text-sm font-bold text-canaa-blue">
                Nova senha
              </label>
              <input
                id="newPassword2"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800
                  shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword2" className="text-sm font-bold text-canaa-blue">
                Confirmar nova senha
              </label>
              <input
                id="confirmPassword2"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5 text-sm text-slate-800
                  shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
              />
            </div>

            {passwordError && <p className="text-xs font-semibold text-red-500">{passwordError}</p>}
            {passwordMsg && <p className="text-xs font-semibold text-emerald-600">{passwordMsg}</p>}

            <button
              type="submit"
              className="w-fit rounded-lg bg-canaa-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            >
              Salvar nova senha
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
