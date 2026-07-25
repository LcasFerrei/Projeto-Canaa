import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiEdit3,
  FiHeart,
  FiHome,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { FaCross } from "react-icons/fa";
import { deleteMember, getMember } from "../api/membersApi";
import { calcularIdade, formatarData } from "../utils/idade";

function PessoaFoto({ fotoUrl, nome }) {
  return (
    <div className="pessoa-foto">
      {fotoUrl ? <img src={fotoUrl} alt={nome} /> : <FiUser />}
    </div>
  );
}

export default function DetalheIrmao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    getMember(id)
      .then(setMember)
      .catch((err) => setErro(err.message));
  }, [id]);

  async function handleExcluir() {
    if (!confirm("Tem certeza que deseja excluir este cadastro?")) return;
    await deleteMember(id);
    navigate("/admin");
  }

  if (erro) return <div className="page">{erro}</div>;
  if (!member) return <div className="page">Carregando...</div>;

  const idade = calcularIdade(member.dataNascimento);

  return (
    <div className="page">
      <Link to="/admin" className="back-link">
        <FiArrowLeft /> Voltar
      </Link>

      <div className="detalhe">
        <div className="detalhe__cabecalho">
          <PessoaFoto fotoUrl={member.fotoUrl} nome={member.nome} />
          <div>
            <h1>{member.nome}</h1>
            <p>{idade !== null ? `${idade} anos` : "Idade não informada"} · {formatarData(member.dataNascimento)}</p>
          </div>
          <div className="detalhe__acoes">
            <Link to={`/admin/irmao/${id}/editar`} className="icon-btn icon-btn--outline">
              <FiEdit3 /> Editar
            </Link>
            <button className="icon-btn icon-btn--danger" onClick={handleExcluir}>
              <FiTrash2 /> Excluir
            </button>
          </div>
        </div>

        <div className="detalhe__campo">
          <FiHome />
          <span>{member.endereco || "Endereço não informado"}</span>
        </div>

        {member.dataConversao && (
          <div className="detalhe__campo">
            <FaCross />
            <span>Aceitou Jesus em {formatarData(member.dataConversao)}</span>
          </div>
        )}

        <div className="detalhe__campo">
          <FiBriefcase />
          <span>
            {member.trabalhoIgreja
              ? `Trabalho na igreja: ${member.trabalhoDescricao}`
              : "Não faz trabalho na igreja"}
          </span>
        </div>

        {member.casado && member.conjuge && (
          <section className="detalhe__secao">
            <h2>
              <FiHeart /> Cônjuge
            </h2>
            <div className="pessoa-card">
              <PessoaFoto fotoUrl={member.conjuge.fotoUrl} nome={member.conjuge.nome} />
              <div>
                <strong>{member.conjuge.nome}</strong>
                <span>
                  {calcularIdade(member.conjuge.dataNascimento) !== null
                    ? `${calcularIdade(member.conjuge.dataNascimento)} anos`
                    : "Idade não informada"}{" "}
                  · {formatarData(member.conjuge.dataNascimento)}
                </span>
              </div>
            </div>
          </section>
        )}

        {member.temFilhos && member.filhos.length > 0 && (
          <section className="detalhe__secao">
            <h2>
              <FiUsers /> Filhos
            </h2>
            <div className="pessoa-grid">
              {member.filhos.map((filho) => (
                <div className="pessoa-card" key={filho.id}>
                  <PessoaFoto fotoUrl={filho.fotoUrl} nome={filho.nome} />
                  <div>
                    <strong>{filho.nome}</strong>
                    <span>
                      {calcularIdade(filho.dataNascimento) !== null
                        ? `${calcularIdade(filho.dataNascimento)} anos`
                        : "Idade não informada"}{" "}
                      · {formatarData(filho.dataNascimento)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
