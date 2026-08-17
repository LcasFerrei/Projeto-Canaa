export const FIELD_TYPES = {
  text: { label: "Texto curto" },
  textarea: { label: "Texto longo" },
  number: { label: "Número" },
  tel: { label: "Telefone" },
  date: { label: "Data" },
  radio: { label: "Múltipla escolha" },
  photo: { label: "Foto (especial)" },
  "children-list": { label: "Lista de filhos (especial)" },
};

// Campos que sustentam funcionalidades do painel admin (abas, estatísticas) ou
// são estruturalmente especiais — não podem ser removidos, só editados/reordenados.
export const PROTECTED_FIELD_IDS = new Set([
  "foto",
  "nomeCompleto",
  "dataNascimento",
  "telefone",
  "estadoCivil",
  "temFilhos",
  "filhosCongregam",
  "bairro",
  "areaAtuacao",
]);

export const DEFAULT_SCHEMA = {
  steps: [
    {
      id: "pessoal",
      title: "Informações Pessoais",
      fields: [
        { id: "foto", type: "photo", label: "Foto" },
        { id: "nomeCompleto", type: "text", label: "Nome completo", required: true },
        { id: "dataNascimento", type: "date", label: "Data de Nascimento", required: true },
        {
          id: "anoConversao",
          type: "number",
          label: "Ano de Conversão (Quando aceitou Jesus)",
          required: false,
          placeholder: "Ex: 2015",
        },
        {
          id: "anoBatismo",
          type: "number",
          label: "Ano de Batismo nas Águas",
          required: false,
          placeholder: "Ex: 2016",
        },
        {
          id: "telefone",
          type: "tel",
          label: "Telefone para contato",
          required: true,
          placeholder: "(00) 00000-0000",
        },
      ],
    },
    {
      id: "familia",
      title: "Informações da Família",
      fields: [
        {
          id: "estadoCivil",
          type: "radio",
          label: "Estado Civil",
          required: true,
          options: [
            { value: "casado", label: "Casado(a)" },
            { value: "solteiro", label: "solteiro(a)" },
            { value: "convivio", label: "Convívio Marital" },
            { value: "viuvo", label: "Viúvo(a)" },
          ],
        },
        {
          id: "nomeConjuge",
          type: "text",
          label:
            "Caso o Esposo, Esposa, Companheiro ou Companheira frequente a nossa Igreja, informar o nome completo",
          required: false,
        },
        {
          id: "temFilhos",
          type: "radio",
          label: "Tem filhos?",
          required: true,
          options: [
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ],
        },
        {
          id: "filhosCongregam",
          type: "children-list",
          label: "Nome Completo dos Filhos que Congregam na Igreja",
        },
      ],
    },
    {
      id: "localizacao",
      title: "Informações de Localização",
      fields: [
        { id: "endereco", type: "text", label: "Endereço", required: true },
        { id: "numero", type: "text", label: "Nº Casa ou Apartamento", required: false },
        { id: "bairro", type: "text", label: "Bairro", required: true },
        {
          id: "complemento",
          type: "text",
          label: "Informações Complementares do Endereço",
          required: false,
        },
      ],
    },
    {
      id: "comercial",
      title: "Informações Comerciais\npara Divulgação",
      fields: [
        {
          id: "areaAtuacao",
          type: "text",
          label: "Caso preste algum tipo de serviço, informar qual área de atuação.",
          required: false,
        },
        {
          id: "produtos",
          type: "text",
          label: "Caso trabalhe com vendas de algum tipo de produto, informar quais produtos.",
          required: false,
        },
        {
          id: "empresaNome",
          type: "text",
          label: "Caso Tenha empresa ou algum tipo de negócio, informar nome da Empresa ou Negócio.",
          required: false,
        },
        { id: "contatoComercial", type: "tel", label: "Contato Comercial", required: false },
        { id: "enderecoComercial", type: "text", label: "Endereço comercial", required: false },
      ],
    },
  ],
};
