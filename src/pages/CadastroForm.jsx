import { useCadastroForm } from "../hooks/useCadastroForm";
import CadastroLayout from "../components/CadastroLayout";
import SuccessScreen from "../components/SuccessScreen";
import DynamicStep from "../components/form/DynamicStep";

export default function CadastroForm() {
  const {
    schema,
    stepCount,
    step,
    formData,
    errors,
    submitted,
    updateField,
    updateFilho,
    addFilho,
    removeFilho,
    goNext,
    goBack,
    resetForm,
  } = useCadastroForm();

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
