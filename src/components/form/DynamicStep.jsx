import FormCard from "../FormCard";
import DynamicField from "./DynamicField";

export default function DynamicStep({ step, formData, errors, updateField, updateFilho, addFilho, removeFilho }) {
  const photoField = step.fields.find((f) => f.type === "photo");
  const otherFields = step.fields.filter((f) => f.type !== "photo");

  return (
    <FormCard title={photoField ? undefined : step.title}>
      {photoField && (
        <>
          <DynamicField field={photoField} formData={formData} errors={errors} updateField={updateField} />
          <h2 className="whitespace-pre-line text-center text-base font-extrabold uppercase text-canaa-blue sm:text-lg">
            {step.title}
          </h2>
        </>
      )}
      {otherFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          formData={formData}
          errors={errors}
          updateField={updateField}
          updateFilho={updateFilho}
          addFilho={addFilho}
          removeFilho={removeFilho}
        />
      ))}
    </FormCard>
  );
}
