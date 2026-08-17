import logo from "../assets/canaa-logo.png";

export default function SuccessScreen({ onNewRegistration }) {
  return (
    <div className="flex min-h-screen justify-center bg-[#000c47] sm:items-center sm:p-6">
      <div className="flex w-full max-w-[460px] flex-col items-center justify-center gap-6 bg-canaa-dark px-6 py-16 text-center sm:rounded-3xl sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
        <img src={logo} alt="Ministério Canaã" className="h-10 w-auto" />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-canaa-light">
          <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-canaa-dark">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-xl font-extrabold uppercase text-canaa-white">Cadastro enviado!</h1>
        <p className="text-sm text-canaa-light">
          Obrigado por atualizar seus dados. Que Deus abençoe sua vida!
        </p>
        <button
          type="button"
          onClick={onNewRegistration}
          className="mt-4 rounded-xl bg-canaa-blue px-6 py-3 text-sm font-bold text-canaa-white shadow-md transition hover:brightness-110"
        >
          Fazer novo cadastro
        </button>
      </div>
    </div>
  );
}
