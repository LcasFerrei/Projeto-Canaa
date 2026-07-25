import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiGift, FiSearch, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import { deleteMember, listMembers } from "../api/membersApi";
import { calcularIdade, mesEDia, NOMES_MESES } from "../utils/idade";

function aniversariantesDoMes(members) {
  const mesAtual = new Date().getMonth() + 1;
  const lista = [];

  members.forEach((member) => {
    const nascTitular = mesEDia(member.dataNascimento);
    if (nascTitular && nascTitular.mes === mesAtual) {
      lista.push({ memberId: member.id, nome: member.nome, dia: nascTitular.dia, relacao: null });
    }

    if (member.casado && member.conjuge) {
      const nascConjuge = mesEDia(member.conjuge.dataNascimento);
      if (nascConjuge && nascConjuge.mes === mesAtual) {
        lista.push({
          memberId: member.id,
          nome: member.conjuge.nome,
          dia: nascConjuge.dia,
          relacao: `cônjuge de ${member.nome}`,
        });
      }
    }

    (member.filhos || []).forEach((filho) => {
      const nascFilho = mesEDia(filho.dataNascimento);
      if (nascFilho && nascFilho.mes === mesAtual) {
        lista.push({
          memberId: member.id,
          nome: filho.nome,
          dia: nascFilho.dia,
          relacao: `filho(a) de ${member.nome}`,
        });
      }
    });
  });

  return lista.sort((a, b) => a.dia - b.dia);
}

export default function PainelAdmin() {
  const [members, setMembers] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarMembros();
  }, []);

  async function carregarMembros() {
    setCarregando(true);
    try {
      const data = await listMembers();
      setMembers(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleExcluir(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir este cadastro?")) return;
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const membrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return members;
    return members.filter((m) => m.nome.toLowerCase().includes(termo));
  }, [members, busca]);

  const aniversariantes = useMemo(() => aniversariantesDoMes(members), [members]);
  const nomeMesAtual = NOMES_MESES[new Date().getMonth()];

  return (
    <div className="page">
      <header className="page__header">
        <FiUsers className="page__header-icon" />
        <div>
          <h1>Painel do Administrador</h1>
          <p>{members.length} irmão(s) cadastrado(s)</p>
        </div>
      </header>

      {aniversariantes.length > 0 && (
        <div className="aniversariantes">
          <h2>
            <FiGift /> Aniversariantes de {nomeMesAtual}
          </h2>
          <div className="aniversariantes__lista">
            {aniversariantes.map((a, i) => (
              <Link
                to={`/admin/irmao/${a.memberId}`}
                key={i}
                className="aniversariantes__item"
              >
                <span className="aniversariantes__dia">{String(a.dia).padStart(2, "0")}</span>
                <span>
                  <strong>{a.nome}</strong>
                  {a.relacao && <span className="aniversariantes__relacao"> · {a.relacao}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {erro && <p className="form-erro">{erro}</p>}
      {carregando && <p>Carregando...</p>}

      {!carregando && membrosFiltrados.length === 0 && (
        <p className="empty-state">Nenhum irmão encontrado.</p>
      )}

      <div className="member-list">
        {membrosFiltrados.map((member) => (
          <Link to={`/admin/irmao/${member.id}`} key={member.id} className="member-card">
            <div className="member-card__foto">
              {member.fotoUrl ? (
                <img src={member.fotoUrl} alt={member.nome} />
              ) : (
                <FiUser />
              )}
            </div>
            <div className="member-card__info">
              <strong>{member.nome}</strong>
              <span>
                {calcularIdade(member.dataNascimento) !== null
                  ? `${calcularIdade(member.dataNascimento)} anos`
                  : "Idade não informada"}
                {" · "}
                {member.casado ? "Casado(a)" : "Solteiro(a)"}
                {member.trabalhoIgreja ? ` · ${member.trabalhoDescricao}` : ""}
              </span>
              <span className="member-card__endereco">{member.endereco}</span>
            </div>
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={(e) => handleExcluir(e, member.id)}
            >
              <FiTrash2 />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
