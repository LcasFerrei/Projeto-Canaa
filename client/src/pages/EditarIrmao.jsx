import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import MemberForm from "../components/MemberForm";
import { getMember, updateMember } from "../api/membersApi";

export default function EditarIrmao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    getMember(id)
      .then(setMember)
      .catch((err) => setErro(err.message));
  }, [id]);

  if (erro) return <div className="page">{erro}</div>;
  if (!member) return <div className="page">Carregando...</div>;

  return (
    <div className="page">
      <Link to={`/admin/irmao/${id}`} className="back-link">
        <FiArrowLeft /> Voltar
      </Link>

      <header className="page__header">
        <FiEdit3 className="page__header-icon" />
        <div>
          <h1>Editar cadastro</h1>
          <p>Atualize os dados de {member.nome}.</p>
        </div>
      </header>

      <MemberForm
        initialMember={member}
        submitLabel="Salvar alterações"
        onSubmit={async (formData) => {
          await updateMember(id, formData);
          navigate(`/admin/irmao/${id}`);
        }}
      />
    </div>
  );
}
