import TextField from "../ui/TextField";
import RadioGroup from "../ui/RadioGroup";
import PhotoUpload from "../ui/PhotoUpload";
import ChildrenFieldList from "../ui/ChildrenFieldList";

export default function DynamicField({
  field,
  formData,
  errors,
  updateField,
  updateFilho,
  addFilho,
  removeFilho,
}) {
  const value = formData[field.id];
  const error = errors?.[field.id];

  switch (field.type) {
    case "photo":
      return <PhotoUpload value={value} onChange={(v) => updateField(field.id, v)} />;

    case "radio":
      return (
        <RadioGroup
          label={field.label}
          name={field.id}
          value={value}
          onChange={updateField}
          options={field.options || []}
          error={error}
        />
      );

    case "children-list":
      if (formData.temFilhos !== "sim") return null;
      return (
        <ChildrenFieldList
          filhos={Array.isArray(value) && value.length ? value : [""]}
          updateFilho={updateFilho}
          addFilho={addFilho}
          removeFilho={removeFilho}
        />
      );

    case "textarea":
      return (
        <TextField
          label={field.label}
          name={field.id}
          value={value}
          onChange={updateField}
          placeholder={field.placeholder}
          error={error}
          required={field.required}
          multiline
        />
      );

    default:
      return (
        <TextField
          label={field.label}
          name={field.id}
          value={value}
          onChange={updateField}
          type={field.type}
          placeholder={field.placeholder}
          error={error}
          required={field.required}
        />
      );
  }
}
