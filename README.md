# Canaã Lagoa Redonda — Atualização de Dados

Formulário de cadastro/atualização de dados dos membros, seguindo o layout e a paleta de cores do PDF de referência. O formulário é configurável — o Ernane pode adicionar, editar, remover e reordenar as perguntas pelo painel administrativo, sem precisar mexer no código. Os dados ficam num backend central (Cloudflare Worker + KV), então aparecem iguais em qualquer navegador/dispositivo.

## Rodando o projeto localmente

Precisa de dois processos rodando ao mesmo tempo: o backend (Worker) e o frontend (Vite).

```bash
npm install

# terminal 1 — backend (API), com banco de dados local (não mexe no Cloudflare de verdade)
npx wrangler dev --port 8787

# terminal 2 — frontend
npm run dev
```

Acesse `http://localhost:5173` (o Vite encaminha as chamadas `/api/*` para o Worker em `:8787`, configurado em `vite.config.js`).

- `/` — formulário de cadastro (público, para os membros preencherem)
- `/admin` — painel para o Ernane ver, editar e remover os cadastros, e consultar aniversariantes. Protegido por login (e-mail `ernanedejesus@unifor.br`, senha inicial igual ao e-mail — pode ser trocada em Configurações). A página não tem nenhum link a partir do formulário público.
- `/admin/configuracoes` — trocar a senha e definir a pergunta de segurança usada em "Esqueci a senha" na tela de login
- `/admin/configuracoes/formulario` — editor visual do formulário: adicionar/editar/remover/reordenar perguntas em cada uma das etapas

## Onde os dados ficam salvos

Tudo fica num **Cloudflare KV** (banco de dados chave-valor do Cloudflare), acessado através do Worker (`worker/index.js`) — por isso os cadastros, a pergunta de segurança, a senha do admin e o formulário customizado aparecem iguais não importa de qual navegador ou dispositivo o Ernane acesse.

A única coisa que continua só no navegador é o **rascunho** do formulário (o que a pessoa está digitando antes de enviar) — isso é proposital, não faz sentido sincronizar um cadastro incompleto entre aparelhos.

### Configurando o KV namespace no Cloudflare

1. No painel do Cloudflare, vá em **Storage & Databases → KV** e crie um namespace (ex: `projeto-canaa-kv`).
2. Copie o **ID** do namespace criado.
3. Em `wrangler.jsonc`, troque `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` pelo ID copiado.
4. Faça commit e push — o próximo deploy (via GitHub) já vai usar o KV de verdade.

Sem isso, o Worker em produção tentará usar um binding inválido e as chamadas de API vão falhar.

## Formulário configurável

A estrutura do formulário (etapas e campos) fica salva no KV, editável em `/admin/configuracoes/formulario`. Se nunca foi customizado, o backend serve o padrão definido em `src/config/formSchema.js`.

- Um pequeno conjunto de campos é **protegido** (`PROTECTED_FIELD_IDS` em `src/config/formSchema.js`) — são os que alimentam funcionalidades do painel (abas de Casados, Com filhos, Prestam Serviço, etc.), como `estadoCivil`, `temFilhos`, `areaAtuacao`, `bairro`, `nomeCompleto`, `telefone`, `dataNascimento` e os campos especiais de foto/filhos. Esses não podem ser removidos nem trocar de tipo, mas o texto e as opções continuam editáveis.
- Qualquer campo novo criado pelo Ernane já aparece automaticamente no formulário público, na edição de cadastro do admin (`RecordEditModal.jsx`) e na exportação CSV — tudo lê a mesma definição de schema.
- "Restaurar formulário padrão" (na própria tela do editor) desfaz todas as customizações.

## Estrutura

- `worker/index.js` — API do backend (Cloudflare Worker): login/sessão, cadastros, schema do formulário, pergunta de segurança
- `worker/kv.js` — leitura/escrita no Cloudflare KV
- `src/utils/apiClient.js` — cliente HTTP usado pelo frontend para falar com a API (guarda o token de sessão)
- `src/config/formSchema.js` — schema padrão do formulário e lista de campos protegidos
- `src/utils/formSchemaStorage.js` — carregar/salvar/resetar o schema customizado (via API)
- `src/components/form/DynamicStep.jsx` e `DynamicField.jsx` — renderizam qualquer etapa/campo a partir do schema
- `src/pages/CadastroForm.jsx` — orquestra as etapas do formulário público usando o schema
- `src/hooks/useCadastroForm.js` — estado do formulário, validação (schema-driven) e navegação entre passos
- `src/pages/AdminFormBuilder.jsx` — editor visual do formulário (adicionar/editar/remover/reordenar campos)
- `src/pages/Admin.jsx` — listagem, busca, filtros, estatísticas e abas (Casados, Com filhos, Prestam Serviço, Aniversariantes)
- `src/components/admin/RecordEditModal.jsx` — edição/remoção completa de um cadastro (schema-driven)
- `src/config/church.js` — nome da igreja/unidade exibido no cabeçalho
