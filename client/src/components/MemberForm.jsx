import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiPlus, FiSend } from "react-icons/fi";
import FotoUpload from "./FotoUpload";
import FilhoFields from "./FilhoFields";
import SimNaoToggle from "./SimNaoToggle";

const filhoVazio = () => ({ nome: "", dataNascimento: "", foto: null, fotoUrl: null });

function filhoFromInitial(f) {
  return { nome: f.nome, dataNascimento: f.dataNascimento || "", foto: null, fotoUrl: f.fotoUrl || null };
}

const ETAPAS = ["Seus dados", "Casado(a)?", "Filhos", "Trabalho na igreja"];

export default function MemberForm({ initialMember, onSubmit, submitLabel, wizard = false }) {
  const m = initialMember;

  const [nome, setNome] = useState(m?.nome || "");
  const [foto, setFoto] = useState(null);
  const [fotoAtual] = useState(m?.fotoUrl || null);
  const [dataNascimento, setDataNascimento] = useState(m?.dataNascimento || "");
  const [dataConversao, setDataConversao] = useState(m?.dataConversao || "");
  const [endereco, setEndereco] = useState(m?.endereco || "");

  const [casado, setCasado] = useState(m ? m.casado : null);
  const [conjugeNome, setConjugeNome] = useState(m?.conjuge?.nome || "");
  const [conjugeDataNascimento, setConjugeDataNascimento] = useState(m?.conjuge?.dataNascimento || "");
  const [conjugeFoto, setConjugeFoto] = useState(null);
  const [conjugeFotoAtual] = useState(m?.conjuge?.fotoUrl || null);

  const [temFilhos, setTemFilhos] = useState(m ? m.temFilhos : null);
  const [filhos, setFilhos] = useState(() => (m?.filhos || []).map(filhoFromInitial));

  const [trabalhoIgreja, setTrabalhoIgreja] = useState(m ? m.trabalhoIgreja : null);
  const [trabalhoDescricao, setTrabalhoDescricao] = useState(m?.trabalhoDescricao || "");

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [etapa, setEtapa] = useState(0);

  function adicionarFilho() {
    setFilhos((prev) => [...prev, filhoVazio()]);
  }

  function atualizarFilho(index, novoFilho) {
    setFilhos((prev) => prev.map((f, i) => (i === index ? novoFilho : f)));
  }

  function removerFilho(index) {
    setFilhos((prev) => prev.filter((_, i) => i !== index));
  }

  function validarEtapa(indice) {
    if (indice === 0) {
      if (!nome.trim() || !dataNascimento || !endereco.trim()) {
        return "Preencha nome, data de nascimento e endereço.";
      }
    }
    if (indice === 1) {
      if (casado === null) return "Por favor, informe se é casado(a).";
      if (casado && (!conjugeNome.trim() || !conjugeDataNascimento)) {
        return "Preencha o nome e a data de nascimento do cônjuge.";
      }
    }
    if (indice === 2) {
      if (temFilhos === null) return "Por favor, informe se tem filhos.";
      if (temFilhos && filhos.length === 0) {
        return "Adicione ao menos um filho ou marque \"Não\" em tem filhos.";
      }
      if (temFilhos && filhos.some((f) => !f.nome.trim() || !f.dataNascimento)) {
        return "Preencha nome e data de nascimento de cada filho(a).";
      }
    }
    if (indice === 3) {
      if (trabalhoIgreja === null) return "Por favor, informe se faz algum trabalho na igreja.";
      if (trabalhoIgreja && !trabalhoDescricao.trim()) {
        return "Descreva qual trabalho é feito na igreja.";
      }
    }
    return null;
  }

  async function enviarCadastro() {
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("data_nascimento", dataNascimento);
    formData.append("data_conversao", dataConversao);
    formData.append("endereco", endereco);
    formData.append("casado", casado ? "sim" : "nao");
    if (foto) formData.append("foto", foto);
    else if (fotoAtual) formData.append("foto_atual", fotoAtual);

    if (casado) {
      formData.append("conjuge_nome", conjugeNome);
      formData.append("conjuge_data_nascimento", conjugeDataNascimento);
      if (conjugeFoto) formData.append("conjuge_foto", conjugeFoto);
      else if (conjugeFotoAtual) formData.append("conjuge_foto_atual", conjugeFotoAtual);
    }

    formData.append("tem_filhos", temFilhos ? "sim" : "nao");
    if (temFilhos) {
      formData.append(
        "filhos",
        JSON.stringify(
          filhos.map((f) => ({ nome: f.nome, dataNascimento: f.dataNascimento, fotoUrl: f.fotoUrl || null }))
        )
      );
      filhos.forEach((f, i) => {
        if (f.foto) formData.append(`filho_foto_${i}`, f.foto);
      });
    }

    formData.append("trabalho_igreja", trabalhoIgreja ? "sim" : "nao");
    if (trabalhoIgreja) formData.append("trabalho_descricao", trabalhoDescricao);

    setEnviando(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (wizard) {
      const erroEtapa = validarEtapa(etapa);
      if (erroEtapa) {
        setErro(erroEtapa);
        return;
      }
      if (etapa < ETAPAS.length - 1) {
        setEtapa((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      await enviarCadastro();
      return;
    }

    for (let i = 0; i < ETAPAS.length; i++) {
      const erroEtapa = validarEtapa(i);
      if (erroEtapa) {
        setErro(erroEtapa);
        return;
      }
    }
    await enviarCadastro();
  }

  function handleVoltar() {
    setErro("");
    setEtapa((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const secaoDados = (
    <section className="form-section">
      {!wizard && <h2>Seus dados</h2>}

      <FotoUpload
        label="Sua foto"
        helper="Toque para tirar uma foto ou escolher da galeria"
        size="grande"
        initialUrl={fotoAtual}
        onChange={setFoto}
      />

      <div className="field">
        <label>Nome completo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label>Data de nascimento</label>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Data de conversão (quando aceitou Jesus)</label>
        <input
          type="date"
          value={dataConversao}
          onChange={(e) => setDataConversao(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Endereço</label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          autoComplete="street-address"
          required
        />
      </div>
    </section>
  );

  const secaoCasado = (
    <section className="form-section">
      <SimNaoToggle label="É casado(a)?" value={casado} onChange={setCasado} />

      {casado && (
        <div className="subsection">
          <FotoUpload label="Foto do cônjuge" initialUrl={conjugeFotoAtual} onChange={setConjugeFoto} />
          <div className="field">
            <label>Nome do cônjuge</label>
            <input
              type="text"
              value={conjugeNome}
              onChange={(e) => setConjugeNome(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Data de nascimento do cônjuge</label>
            <input
              type="date"
              value={conjugeDataNascimento}
              onChange={(e) => setConjugeDataNascimento(e.target.value)}
              required
            />
          </div>
        </div>
      )}
    </section>
  );

  const secaoFilhos = (
    <section className="form-section">
      <SimNaoToggle label="Tem filhos?" value={temFilhos} onChange={setTemFilhos} />

      {temFilhos && (
        <div className="subsection">
          {filhos.map((filho, index) => (
            <FilhoFields
              key={index}
              index={index}
              filho={filho}
              onChange={(novoFilho) => atualizarFilho(index, novoFilho)}
              onRemove={() => removerFilho(index)}
            />
          ))}
          <button type="button" className="btn btn--secondary" onClick={adicionarFilho}>
            <FiPlus /> Adicionar filho(a)
          </button>
        </div>
      )}
    </section>
  );

  const secaoTrabalho = (
    <section className="form-section">
      <SimNaoToggle
        label="Faz algum trabalho na igreja?"
        value={trabalhoIgreja}
        onChange={setTrabalhoIgreja}
      />

      {trabalhoIgreja && (
        <div className="subsection">
          <div className="field">
            <label>Qual trabalho?</label>
            <input
              type="text"
              value={trabalhoDescricao}
              onChange={(e) => setTrabalhoDescricao(e.target.value)}
              placeholder="Ex: Louvor, diaconato, ensino..."
              required
            />
          </div>
        </div>
      )}
    </section>
  );

  const secoes = [secaoDados, secaoCasado, secaoFilhos, secaoTrabalho];

  if (!wizard) {
    return (
      <form className="form" onSubmit={handleSubmit}>
        {secoes}
        {erro && <p className="form-erro">{erro}</p>}
        <button type="submit" className="btn btn--primary btn--full" disabled={enviando}>
          <FiSend /> {enviando ? "Enviando..." : submitLabel}
        </button>
      </form>
    );
  }

  const ultimaEtapa = etapa === ETAPAS.length - 1;

  return (
    <form className="form form--wizard" onSubmit={handleSubmit}>
      <div className="wizard-progresso">
        <div className="wizard-progresso__topo">
          <span>
            Passo {etapa + 1} de {ETAPAS.length}
          </span>
          <strong>{ETAPAS[etapa]}</strong>
        </div>
        <div className="wizard-progresso__barra">
          <div
            className="wizard-progresso__preenchido"
            style={{ width: `${((etapa + 1) / ETAPAS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="wizard-etapa" key={etapa}>
        {secoes[etapa]}
        {erro && <p className="form-erro">{erro}</p>}
      </div>

      <div className="wizard-nav">
        {etapa > 0 && (
          <button type="button" className="btn btn--secondary" onClick={handleVoltar}>
            <FiArrowLeft /> Voltar
          </button>
        )}
        <button type="submit" className="btn btn--primary wizard-nav__principal" disabled={enviando}>
          {ultimaEtapa ? (
            <>
              <FiSend /> {enviando ? "Enviando..." : submitLabel}
            </>
          ) : (
            <>
              Próximo <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
