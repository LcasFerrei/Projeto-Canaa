import StepHeader from "./StepHeader";
import NextButton from "./NextButton";

export default function CadastroLayout({ step, totalSteps, onBack, onNext, nextLabel, children }) {
  return (
    <div className="flex min-h-screen justify-center bg-[#000c47] sm:items-center sm:p-6">
      <div className="flex w-full max-w-[460px] flex-col bg-canaa-dark sm:overflow-hidden sm:rounded-3xl sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
        <StepHeader step={step} total={totalSteps} onBack={onBack} />
        <div className="flex-1 px-5 pb-6 sm:px-8">{children}</div>
        <div className="px-5 pb-8 sm:px-8">
          <NextButton onClick={onNext} label={nextLabel} />
        </div>
      </div>
    </div>
  );
}
