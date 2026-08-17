import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/canaa-logo.png";
import { loadRecords, deleteRecord, updateRecord, replaceAllRecords } from "../utils/storage";
import { getAge, daysUntilNextBirthday, formatDayMonth } from "../utils/birthday";
import { downloadCsv } from "../utils/csv";
import { downloadBackup, parseBackupFile } from "../utils/backup";
import { loadSchema } from "../utils/formSchemaStorage";
import RecordEditModal from "../components/admin/RecordEditModal";
import LockIcon from "../components/ui/LockIcon";
import SettingsIcon from "../components/ui/SettingsIcon";
import LogoutIcon from "../components/ui/LogoutIcon";
import LinkIcon from "../components/ui/LinkIcon";
import Login from "./Login";
import { isAuthenticated, logout } from "../utils/auth";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TABS = [
  { id: "todos", label: "Todos os cadastros" },
  { id: "aniversariantes", label: "Aniversariantes" },
  { id: "casados", label: "Casados" },
  { id: "filhos", label: "Com filhos" },
  { id: "servicos", label: "Prestam Serviço" },
];

const LIST_TABS = new Set(["todos", "casados", "filhos", "servicos"]);

const EMPTY_MESSAGE = {
  todos: "Nenhum cadastro encontrado.",
  casados: "Nenhum casado encontrado.",
  filhos: "Nenhum cadastro com filhos encontrado.",
  servicos: "Nenhum cadastro presta serviço ainda.",
};

const COLUMNS = [
  { key: "nome", label: "Membro" },
  { key: "idade", label: "Idade" },
  { key: "telefone", label: "Telefone", sortable: false },
  { key: "bairro", label: "Bairro" },
  { key: "enviadoEm", label: "Enviado em" },
];

function sortValue(record, key) {
  switch (key) {
    case "nome":
      return record.nomeCompleto || "";
    case "idade":
      return getAge(record.dataNascimento) ?? -1;
    case "bairro":
      return record.bairro || "";
    case "enviadoEm":
      return record.enviadoEm || "";
    default:
      return "";
  }
}

function compareRecords(a, b, key, dir) {
  const av = sortValue(a, key);
  const bv = sortValue(b, key);
  const cmp =
    typeof av === "number" && typeof bv === "number"
      ? av - bv
      : String(av).localeCompare(String(bv), "pt-BR");
  return dir === "asc" ? cmp : -cmp;
}

function StatTile({ label, value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition hover:border-canaa-light hover:shadow-md ${
        active ? "border-canaa-blue ring-2 ring-canaa-light/60" : "border-slate-200"
      }`}
    >
      <div className="text-2xl font-extrabold text-canaa-blue">{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
    </button>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [schema, setSchema] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [filterBairro, setFilterBairro] = useState("");
  const [filterEstadoCivil, setFilterEstadoCivil] = useState("");
  const [filterTemFilhos, setFilterTemFilhos] = useState("");
  const [sortKey, setSortKey] = useState("enviadoEm");
  const [sortDir, setSortDir] = useState("desc");
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("todos");
  const [restoreError, setRestoreError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  async function refresh() {
    setLoading(true);
    setLoadError("");
    try {
      const [s, r] = await Promise.all([loadSchema(), loadRecords()]);
      setSchema(s);
      setRecords(r);
    } catch (err) {
      if (!isAuthenticated()) {
        setAuthed(false);
      } else {
        setLoadError(err.message || "Não foi possível carregar os dados.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const bairros = useMemo(
    () => [...new Set(records.map((r) => r.bairro).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [records]
  );

  const estadoCivilOptions = useMemo(
    () => schema?.steps.flatMap((s) => s.fields).find((f) => f.id === "estadoCivil")?.options || [],
    [schema]
  );

  const stats = useMemo(() => {
    const total = records.length;
    const thisMonth = new Date().getMonth();
    const aniversariantesMes = records.filter((r) => {
      if (!r.dataNascimento) return false;
      const month = Number(r.dataNascimento.split("-")[1]) - 1;
      return month === thisMonth;
    }).length;
    const casados = records.filter((r) => r.estadoCivil === "casado").length;
    const comFilhos = records.filter((r) => r.temFilhos === "sim").length;
    const prestamServico = records.filter((r) => r.areaAtuacao?.trim()).length;
    return { total, aniversariantesMes, casados, comFilhos, prestamServico };
  }, [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = records;
    if (tab === "casados") list = list.filter((r) => r.estadoCivil === "casado");
    if (tab === "filhos") list = list.filter((r) => r.temFilhos === "sim");
    if (tab === "servicos") list = list.filter((r) => r.areaAtuacao?.trim());
    if (q) {
      list = list.filter(
        (r) =>
          r.nomeCompleto?.toLowerCase().includes(q) ||
          r.bairro?.toLowerCase().includes(q) ||
          r.telefone?.toLowerCase().includes(q)
      );
    }
    if (filterBairro) list = list.filter((r) => r.bairro === filterBairro);
    if (filterEstadoCivil && tab !== "casados") list = list.filter((r) => r.estadoCivil === filterEstadoCivil);
    if (filterTemFilhos && tab !== "filhos") list = list.filter((r) => r.temFilhos === filterTemFilhos);
    return list.slice().sort((a, b) => compareRecords(a, b, sortKey, sortDir));
  }, [records, tab, query, filterBairro, filterEstadoCivil, filterTemFilhos, sortKey, sortDir]);

  const aniversariantes = useMemo(() => {
    return records
      .filter((r) => r.dataNascimento)
      .map((r) => ({ ...r, dias: daysUntilNextBirthday(r.dataNascimento) }))
      .sort((a, b) => a.dias - b.dias);
  }, [records]);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleDelete(id) {
    await deleteRecord(id);
    setRecords(await loadRecords());
    setEditing(null);
  }

  async function handleSave(data) {
    await updateRecord(data.id, data);
    setRecords(await loadRecords());
    setEditing(null);
  }

  async function handleRestoreFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreError("");
    try {
      const data = await parseBackupFile(file);
      const ok = confirm(
        `Isso vai substituir os ${records.length} cadastros atuais pelos ${data.length} cadastros do backup. Essa ação não pode ser desfeita. Continuar?`
      );
      if (ok) {
        await replaceAllRecords(data);
        setRecords(await loadRecords());
        setEditing(null);
      }
    } catch (err) {
      setRestoreError(err.message);
    } finally {
      e.target.value = "";
    }
  }

  async function handleLogout() {
    await logout();
    setAuthed(false);
  }

  function handleCopyFormLink() {
    const url = `${window.location.origin}/`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {});
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative flex flex-col items-center gap-3 bg-canaa-dark px-5 py-5 sm:px-8">
        <img src={logo} alt="Ministério Canaã" className="h-9 w-auto self-start sm:absolute sm:left-8 sm:top-1/2 sm:-translate-y-1/2" />
        <div className="text-center">
          <h1 className="text-base font-extrabold uppercase text-white sm:text-lg">
            Painel Administrativo
          </h1>
          <p className="text-xs text-canaa-light">Cadastros recebidos · Canaã Lagoa Redonda</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCopyFormLink}
            title="Copiar link do formulário e abrir em nova aba"
            aria-label="Copiar link do formulário e abrir em nova aba"
            className="relative text-canaa-light hover:text-white"
          >
            <LinkIcon className="h-5 w-5" />
            {linkCopied && (
              <span className="absolute -bottom-8 right-0 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                Link copiado!
              </span>
            )}
          </a>
          <Link
            to="/admin/configuracoes"
            title="Configurações"
            aria-label="Configurações"
            className="text-canaa-light hover:text-white"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            aria-label="Sair"
            className="text-canaa-light hover:text-white"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Carregando cadastros...</p>
        ) : loadError ? (
          <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-10 text-center text-sm text-red-600">
            {loadError}
            <div>
              <button onClick={refresh} className="mt-3 font-semibold underline">
                Tentar de novo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <StatTile
                label="Cadastros"
                value={stats.total}
                active={tab === "todos"}
                onClick={() => setTab("todos")}
              />
              <StatTile
                label="Aniversariantes do mês"
                value={stats.aniversariantesMes}
                active={tab === "aniversariantes"}
                onClick={() => setTab("aniversariantes")}
              />
              <StatTile
                label="Casados"
                value={stats.casados}
                active={tab === "casados"}
                onClick={() => setTab("casados")}
              />
              <StatTile
                label="Com filhos"
                value={stats.comFilhos}
                active={tab === "filhos"}
                onClick={() => setTab("filhos")}
              />
              <StatTile
                label="Prestam serviço"
                value={stats.prestamServico}
                active={tab === "servicos"}
                onClick={() => setTab("servicos")}
              />
            </div>

            <div className="mb-5 flex gap-2 border-b border-slate-200">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`border-b-2 px-3 pb-3 text-sm font-bold transition ${
                    tab === t.id
                      ? "border-canaa-blue text-canaa-blue"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {LIST_TABS.has(tab) && (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Buscar por nome, bairro ou telefone..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                      text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-canaa-light"
                  />
                  <select
                    value={filterBairro}
                    onChange={(e) => setFilterBairro(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-canaa-light"
                  >
                    <option value="">Todos os bairros</option>
                    {bairros.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {tab !== "casados" && (
                    <select
                      value={filterEstadoCivil}
                      onChange={(e) => setFilterEstadoCivil(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-canaa-light"
                    >
                      <option value="">Todos os estados civis</option>
                      {estadoCivilOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {tab !== "filhos" && (
                    <select
                      value={filterTemFilhos}
                      onChange={(e) => setFilterTemFilhos(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-canaa-light"
                    >
                      <option value="">Filhos: todos</option>
                      <option value="sim">Tem filhos</option>
                      <option value="nao">Sem filhos</option>
                    </select>
                  )}

                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-canaa-dark">
                      {filtered.length} {filtered.length === 1 ? "cadastro" : "cadastros"}
                    </span>
                    <button
                      onClick={() => downloadCsv(filtered, schema)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
                    >
                      Exportar CSV
                    </button>
                    <button
                      onClick={() => downloadBackup(records)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
                    >
                      Backup (JSON)
                    </button>
                    <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                      Restaurar backup
                      <input type="file" accept="application/json" onChange={handleRestoreFile} className="hidden" />
                    </label>
                  </div>
                </div>

                {restoreError && (
                  <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    {restoreError}
                  </p>
                )}

                {filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                    {EMPTY_MESSAGE[tab] || EMPTY_MESSAGE.todos}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full min-w-[760px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                          {COLUMNS.map((col) => (
                            <th
                              key={col.key}
                              onClick={col.sortable === false ? undefined : () => handleSort(col.key)}
                              className={`px-4 py-3 ${col.sortable === false ? "" : "cursor-pointer select-none hover:text-canaa-blue"}`}
                            >
                              <span className="inline-flex items-center gap-1">
                                {col.label}
                                {sortKey === col.key && <span>{sortDir === "asc" ? "▲" : "▼"}</span>}
                              </span>
                            </th>
                          ))}
                          {tab === "servicos" && <th className="px-4 py-3">Área de Atuação</th>}
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filtered.map((r) => (
                          <tr
                            key={r.id}
                            onClick={() => setEditing(r)}
                            className="cursor-pointer text-slate-700 hover:bg-slate-50"
                          >
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-3 font-semibold text-canaa-blue">
                                {r.foto ? (
                                  <img src={r.foto} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                                ) : (
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canaa-bg text-xs font-bold text-canaa-blue">
                                    {r.nomeCompleto?.[0]?.toUpperCase() || "?"}
                                  </span>
                                )}
                                {r.nomeCompleto || "(sem nome)"}
                                {r.observacoesInternas && (
                                  <span title="Tem observações internas" className="text-amber-500">
                                    <LockIcon className="h-3.5 w-3.5" />
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3">{getAge(r.dataNascimento) ?? "—"}</td>
                            <td className="px-4 py-3">{r.telefone || "—"}</td>
                            <td className="px-4 py-3">{r.bairro || "—"}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{formatDate(r.enviadoEm)}</td>
                            {tab === "servicos" && <td className="px-4 py-3">{r.areaAtuacao}</td>}
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => setEditing(r)}
                                className="text-xs font-semibold text-canaa-blue hover:underline"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {tab === "aniversariantes" && (
              <>
                {aniversariantes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                    Nenhum aniversário cadastrado ainda.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {aniversariantes.map((r) => (
                      <li key={r.id} className="flex items-center justify-between px-4 py-3">
                        <button
                          onClick={() => setEditing(r)}
                          className="flex items-center gap-3 text-left"
                        >
                          {r.foto ? (
                            <img src={r.foto} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canaa-bg text-xs font-bold text-canaa-blue">
                              {r.nomeCompleto?.[0]?.toUpperCase() || "?"}
                            </span>
                          )}
                          <span>
                            <span className="block text-sm font-semibold text-canaa-blue">
                              {r.nomeCompleto || "(sem nome)"}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {formatDayMonth(r.dataNascimento)} · completa {(getAge(r.dataNascimento) ?? 0) + 1} anos
                            </span>
                          </span>
                        </button>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            r.dias === 0
                              ? "bg-canaa-blue text-white"
                              : r.dias <= 7
                                ? "bg-canaa-bg text-canaa-blue"
                                : "text-slate-400"
                          }`}
                        >
                          {r.dias === 0 ? "Hoje!" : `em ${r.dias} dia${r.dias === 1 ? "" : "s"}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </main>

      {editing && (
        <RecordEditModal
          record={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
