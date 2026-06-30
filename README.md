# Bereia — POC

Proof of concept do assistente de estudo bíblico com IA. Web app (roda no navegador, funciona bem no celular) com duas funcionalidades:

- **Chat** (`/`): perguntas livres sobre a Bíblia, explicação de versículos, temas, personagens.
- **Devocional** (`/devocional`): devocional diário gerado por IA.

Sem RAG nesta primeira versão — o modelo responde com seu próprio conhecimento bíblico, guiado por um system prompt cuidadoso (`lib/prompts.ts`). Isso é proposital: valida a ideia rápido. Se notar alucinações ou erros de referência durante os testes, é o sinal para investir em RAG (busca em base bíblica real) na próxima iteração.

## Como rodar localmente

1. Instale as dependências:
   ```
   npm install
   ```
2. Copie `.env.local.example` para `.env.local` e preencha `ANTHROPIC_API_KEY` com uma chave do [console.anthropic.com](https://console.anthropic.com).
3. Rode:
   ```
   npm run dev
   ```
4. Abra `http://localhost:3000`.

## Estrutura do projeto

```
app/
  page.tsx               → tela de chat (home)
  devocional/page.tsx    → tela de devocional
  api/chat/route.ts      → endpoint que chama a IA para o chat
  api/devotional/route.ts→ endpoint que gera o devocional do dia
components/
  ChatView.tsx           → lógica e UI do chat
  Header.tsx              → navegação
lib/
  prompts.ts               → AQUI fica o "cérebro" do produto — os system prompts
  anthropic.ts              → cliente da API
```

## O que falta de propósito (por ser POC)

Cortado deliberadamente para validar rápido com usuários reais antes de investir mais:

- **Login**: ainda não implementado. Para testar com um grupo pequeno, dá pra rodar assim mesmo (sem autenticação) ou adicionar Supabase Auth depois — já deixei `@supabase/supabase-js` instalado para isso.
- **Limite de perguntas/dia**: não implementado (no modelo de negócio do plano original, gratuito = 20/dia). Tem um `TODO` marcado em `app/api/chat/route.ts`.
- **Histórico/Favoritos**: o chat não salva nada — recarregar a página apaga a conversa. Adicionar isso é o primeiro passo natural depois da POC, com uma tabela no Supabase.
- **RAG / base bíblica real**: o assistente responde do conhecimento do modelo. Funciona bem para a maioria das perguntas, mas pode errar referências exatas ocasionalmente — vale monitorar isso nos testes.

## Como publicar para testar com usuários reais

Caminho mais rápido: [Vercel](https://vercel.com) (gratuito para esse volume de uso).

1. Suba este projeto para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Em "Environment Variables", adicione `ANTHROPIC_API_KEY`.
4. Deploy. Você recebe uma URL pública (`algo.vercel.app`) para mandar aos primeiros testadores.

## Sugestão de roteiro de teste com usuários

Para validar a hipótese central ("as pessoas acham valor nisso e voltam a usar"):

- Recrute 10-15 pessoas de perfis variados (membro de igreja comum, líder, novo convertido).
- Peça que usem por 1 semana, sem instruções rígidas — só "use quando tiver uma dúvida bíblica ou quiser o devocional do dia".
- Colete: quantas vezes voltaram a usar, quais perguntas fizeram (isso te diz quais funcionalidades da Fase 2/3 priorizar), e se indicariam para alguém.
- Pergunta-chave pós-teste: "Se isso desaparecesse amanhã, você sentiria falta?" — é o teste de product-market fit mais simples que existe.
