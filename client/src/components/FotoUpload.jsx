import { useEffect, useRef, useState } from "react";
import { FiCamera, FiUser } from "react-icons/fi";

export default function FotoUpload({ label, onChange, error, initialUrl, helper, size }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
    onChange(file);
  }

  const imagemExibida = preview || initialUrl;

  return (
    <div className="foto-upload">
      <button
        type="button"
        className={`foto-upload__circle${size === "grande" ? " foto-upload__circle--grande" : ""}${error ? " foto-upload__circle--error" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <span className="foto-upload__conteudo">
          {imagemExibida ? (
            <img src={imagemExibida} alt="Prévia da foto" />
          ) : (
            <FiUser className="foto-upload__placeholder" />
          )}
        </span>
        <span className="foto-upload__badge">
          <FiCamera />
        </span>
      </button>
      <label className="foto-upload__label" onClick={() => inputRef.current?.click()}>
        {label}
      </label>
      {helper && <p className="foto-upload__helper">{helper}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
}
