# Canaã Lagoa Redonda — Atualização de Dados

Formulário de cadastro/atualização de dados dos membros, seguindo o layout e a paleta de cores do PDF de referência. O formulário é configurável — o Ernane pode adicionar, editar, remover e reordenar as perguntas pelo painel administrativo, sem precisar mexer no código.

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

- `/` — formulário de cadastro (público, para os membros preencherem)
- `/admin` — painel para o Ernane ver, editar e remover os cadastros, e consultar aniversariantes. Protegido por login (e-mail `ernanedejesus@unifor.br`, definido em `src/utils/auth.js`). A página não tem nenhum link a partir do formulário público.
- `/admin/configuracoes` — trocar a senha e definir a pergunta de segurança usada em "Esqueci a senha" na tela de login
- `/admin/configuracoes/formulario` — editor visual do formulário: adicionar/editar/remover/reordenar perguntas em cada uma das etapas

## Onde os dados ficam salvos

Por enquanto os cadastros são salvos no `localStorage` do navegador (chave `canaa_cadastros`), sem backend. Isso é suficiente para testar o fluxo, mas para uso real (o admin ver cadastros de qualquer dispositivo) será necessário plugar um banco de dados/backend — próximo passo natural do projeto.

## Formulário configurável

O formulário não é mais hardcoded: sua estrutura (etapas e campos) fica em um "schema" salvo em `localStorage` (chave `canaa_form_schema`), editável em `/admin/configuracoes/formulario`. Se nunca foi customizado, cai no padrão definido em `src/config/formSchema.js`.

- Um pequeno conjunto de campos é **protegido** (`PROTECTED_FIELD_IDS` em `src/config/formSchema.js`) — são os que alimentam funcionalidades do painel (abas de Casados, Com filhos, Prestam Serviço, etc.), como `estadoCivil`, `temFilhos`, `areaAtuacao`, `bairro`, `nomeCompleto`, `telefone`, `dataNascimento` e os campos especiais de foto/filhos. Esses não podem ser removidos nem trocar de tipo, mas o texto e as opções continuam editáveis.
- Qualquer campo novo criado pelo Ernane já aparece automaticamente no formulário público, na edição de cadastro do admin (`RecordEditModal.jsx`) e na exportação CSV — tudo lê a mesma definição de schema.
- "Restaurar formulário padrão" (na própria tela do editor) desfaz todas as customizações.

## Estrutura

- `src/config/formSchema.js` — schema padrão do formulário e lista de campos protegidos
- `src/utils/formSchemaStorage.js` — carregar/salvar/resetar o schema customizado
- `src/components/form/DynamicStep.jsx` e `DynamicField.jsx` — renderizam qualquer etapa/campo a partir do schema
- `src/pages/CadastroForm.jsx` — orquestra as etapas do formulário público usando o schema
- `src/hooks/useCadastroForm.js` — estado do formulário, validação (schema-driven) e navegação entre passos
- `src/pages/AdminFormBuilder.jsx` — editor visual do formulário (adicionar/editar/remover/reordenar campos)
- `src/pages/Admin.jsx` — listagem, busca, filtros, estatísticas e abas (Casados, Com filhos, Prestam Serviço, Aniversariantes)
- `src/components/admin/RecordEditModal.jsx` — edição/remoção completa de um cadastro (schema-driven)
- `src/config/church.js` — nome da igreja/unidade exibido no cabeçalho
