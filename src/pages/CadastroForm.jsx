import { useCadastroForm } from "../hooks/useCadastroForm";
import CadastroLayout from "../components/CadastroLayout";
import SuccessScreen from "../components/SuccessScreen";
import DynamicStep from "../components/form/DynamicStep";
import logo from "../assets/canaa-logo.png";

export default function CadastroForm() {
  const {
    schema,
    loadingSchema,
    stepCount,
    step,
    formData,
    errors,
    submitted,
    submitting,
    submitError,
    updateField,
    updateFilho,
    addFilho,
    removeFilho,
    goNext,
    goBack,
    resetForm,
  } = useCadastroForm();

  if (loadingSchema) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canaa-dark">
        <img src={logo} alt="Ministério Canaã" className="h-12 w-auto animate-pulse" />
        <p className="text-sm text-canaa-light">Carregando formulário...</p>
      </div>
    );
  }

  if (submitted) {
    return <SuccessScreen onNewRegistration={resetForm} />;
  }

  const stepDef = schema.steps[step - 1];

  return (
    <CadastroLayout
      step={step}
      totalSteps={stepCount}
      onBack={goBack}
      onNext={goNext}
      nextLabel={step === stepCount ? "Enviar" : "Próximo"}
      loading={submitting}
      error={submitError}
    >
      <DynamicStep
        step={stepDef}
        formData={formData}
        errors={errors}
        updateField={updateField}
        updateFilho={updateFilho}
        addFilho={addFilho}
        removeFilho={removeFilho}
      />
    </CadastroLayout>
  );
}
