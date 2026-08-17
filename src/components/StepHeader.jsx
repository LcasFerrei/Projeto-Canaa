import logo from "../assets/canaa-logo.png";
import ProgressBar from "./ProgressBar";
import { CHURCH } from "../config/church";

export default function StepHeader({ step, total, onBack }) {
  return (
    <div className="px-5 pt-7 pb-5 sm:px-8">
      <div className="relative mb-5 flex items-center justify-center">
        <img src={logo} alt="Ministério Canaã" className="h-9 w-auto sm:h-10" />
        {step > 1 && (
          <button
            type="button"
            onClick={onBack}
            className="absolute right-0 text-xs font-semibold text-canaa-light underline-offset-2 hover:underline"
          >
            ‹ Voltar
          </button>
        )}
      </div>
      <h1 className="text-center text-lg font-extrabold uppercase leading-tight text-canaa-white sm:text-xl">
        {CHURCH.formTitle}
        <br />
        {CHURCH.unitName}
      </h1>
      <div className="mt-4">
        <ProgressBar step={step} total={total} />
      </div>
    </div>
  );
}
