import { FiTrash2 } from "react-icons/fi";
import FotoUpload from "./FotoUpload";

export default function FilhoFields({ index, filho, onChange, onRemove }) {
  return (
    <div className="filho-card">
      <div className="filho-card__header">
        <h4>Filho(a) {index + 1}</h4>
        <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove}>
          <FiTrash2 />
        </button>
      </div>

      <FotoUpload
        label="Foto"
        initialUrl={filho.fotoUrl}
        onChange={(file) => onChange({ ...filho, foto: file })}
      />

      <div className="field">
        <label>Nome</label>
        <input
          type="text"
          value={filho.nome}
          onChange={(e) => onChange({ ...filho, nome: e.target.value })}
          required
        />
      </div>

      <div className="field">
        <label>Data de nascimento</label>
        <input
          type="date"
          value={filho.dataNascimento}
          onChange={(e) => onChange({ ...filho, dataNascimento: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
