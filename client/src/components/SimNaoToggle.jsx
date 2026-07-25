import { FiCheck, FiX } from "react-icons/fi";

export default function SimNaoToggle({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="sim-nao-toggle">
        <button
          type="button"
          className={`sim-nao-toggle__btn${value === true ? " sim-nao-toggle__btn--active-sim" : ""}`}
          onClick={() => onChange(true)}
        >
          <FiCheck /> Sim
        </button>
        <button
          type="button"
          className={`sim-nao-toggle__btn${value === false ? " sim-nao-toggle__btn--active-nao" : ""}`}
          onClick={() => onChange(false)}
        >
          <FiX /> Não
        </button>
      </div>
    </div>
  );
}
