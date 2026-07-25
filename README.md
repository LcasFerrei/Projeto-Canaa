# Cadastro de Irmãos da Igreja

Sistema com dois lugares:

1. **Formulário público** (`/`) — qualquer irmão preenche pelo celular ou computador, sem login.
2. **Painel do administrador** (`/admin`) — o pastor vê a lista de todos os cadastros e o detalhe de cada um. Por enquanto não tem senha (qualquer pessoa com o link acessa).

Os dados e as fotos ficam salvos localmente (banco SQLite + pasta de uploads), não depende de internet nem de serviço externo.

## Estrutura

```
server/   → backend (Node.js + Express + SQLite)
client/   → frontend (React + Vite)
```

## Como rodar

Você precisa ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou mais recente).

### 1. Backend

```
cd server
npm install
npm start
```

Isso sobe o servidor em `http://localhost:3001`. O banco de dados (`server/data/church.db`) e as fotos (`server/uploads/`) são criados automaticamente.

### 2. Frontend

Em outro terminal:

```
cd client
npm install
npm run dev
```

Isso abre o site em `http://localhost:5173`. O formulário público fica em `http://localhost:5173/` e o painel admin em `http://localhost:5173/admin`.

**Importante:** o backend (passo 1) precisa estar rodando para o site funcionar — é ele quem guarda os cadastros e as fotos.

## Uso pelo celular

Para os irmãos preencherem o formulário pelo celular, o computador onde o backend e o frontend estão rodando precisa estar acessível na mesma rede (Wi-Fi) ou publicado na internet. Para uso na igreja pela rede local, descubra o IP do computador (`ipconfig` no Windows) e acesse pelo celular em `http://<IP-do-computador>:5173`.

Para deixar acessível de qualquer lugar (fora da rede da igreja), o projeto precisaria ser publicado em um serviço de hospedagem — isso pode ser um próximo passo quando o projeto crescer.

## O que já funciona

- Cadastro com nome, foto, data de nascimento (idade é calculada automaticamente) e endereço.
- Pergunta se é casado(a); se sim, pede nome, data de nascimento e foto do cônjuge.
- Pergunta se tem filhos; se sim, permite adicionar quantos filhos forem necessários, cada um com nome, data de nascimento e foto.
- Pergunta se faz algum trabalho na igreja; se sim, pede para descrever qual.
- Painel admin com busca por nome, lista de todos os cadastros e página de detalhe com fotos de todos (titular, cônjuge e filhos).
- Botão de excluir cadastro (para corrigir duplicados ou erros).

## Possíveis melhorias futuras

- Login/senha para proteger o painel admin.
- Edição de cadastros (hoje só é possível excluir e pedir para o irmão preencher de novo).
- Publicar o site na internet para acesso de qualquer lugar.
