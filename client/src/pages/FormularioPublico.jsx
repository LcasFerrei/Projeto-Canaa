import { useState } from "react";
import { FiCheckCircle, FiUsers } from "react-icons/fi";
import MemberForm from "../components/MemberForm";
import { createMember } from "../api/membersApi";

export default function FormularioPublico() {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="page page--centered">
        <div className="confirmacao">
          <FiCheckCircle className="confirmacao__icon" />
          <h2>Cadastro enviado com sucesso!</h2>
          <p>Obrigado por preencher os dados. Que Deus abençoe.</p>
          <button className="btn btn--primary" onClick={() => setEnviado(false)}>
            Fazer novo cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--formulario">
      <header className="page__header page__header--compacto">
        <FiUsers className="page__header-icon" />
        <div>
          <h1>Cadastro de Irmãos</h1>
        </div>
      </header>

      <MemberForm
        wizard
        submitLabel="Enviar cadastro"
        onSubmit={async (formData) => {
          await createMember(formData);
          setEnviado(true);
        }}
      />
    </div>
  );
}
