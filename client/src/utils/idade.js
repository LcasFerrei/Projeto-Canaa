export function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const nascimento = new Date(dataNascimento);
  if (Number.isNaN(nascimento.getTime())) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade -= 1;
  return idade >= 0 ? idade : null;
}

export function formatarData(dataISO) {
  if (!dataISO) return "-";
  const [ano, mes, dia] = dataISO.split("-");
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

// Extrai mês/dia direto da string "AAAA-MM-DD" (sem passar por Date, que
// interpreta a data como UTC e pode voltar um dia em fusos negativos como o do Brasil).
export function mesEDia(dataISO) {
  if (!dataISO) return null;
  const [, mesStr, diaStr] = dataISO.split("-");
  const mes = Number(mesStr);
  const dia = Number(diaStr);
  if (!mes || !dia) return null;
  return { mes, dia };
}

export const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
