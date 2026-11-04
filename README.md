# Obsidian Second Brain

Transforme a pasta do projeto em um vault para decisões, estudos e notas de trabalho. O fluxo tem três etapas. Ele registra o servidor MCP no agente local, configura o vault e orienta o agente a consultar notas relevantes antes de responder.

## Começar no Claude Code, Codex ou OpenCode

Na raiz do projeto, instale a skill com Node.js 22.20 ou superior e npm:

```sh
npx skills add n1systempc/obsidian-second-brain --skill obsidian
```

Escolha seu agente e a instalação por projeto. Abra uma sessão no mesmo projeto. Se quiser instalar manualmente, copie a pasta inteira [skills/obsidian](skills/obsidian) para `.claude/skills/` no Claude Code, `.agents/skills/` no Codex ou `.opencode/skills/` no OpenCode. A distribuição com o nome anterior `obsidian-second-brain` continua disponível com o mesmo fluxo. Instale apenas um dos nomes.

| Cliente | Pedido no chat do projeto |
| --- | --- |
| Claude Code | `/obsidian install` |
| Codex | `$obsidian install` |
| OpenCode ou cliente sem atalho de skill | `Use a skill obsidian para instalar e configurar o vault deste projeto.` |

O pedido acima é feito ao agente. Ele usa o terminal da sessão para configurar o servidor.

### 1. Instalação do MCP

O projeto aberto é o vault. O agente resolve seu caminho absoluto e registra o servidor [@bitbonsai/mcpvault](https://github.com/bitbonsai/mcpvault) com `claude mcp add obsidian -- npx -y @bitbonsai/mcpvault "<raiz-do-projeto>"` ou o equivalente `codex mcp add`. No OpenCode ele usa a configuração MCP local. Se o nome estiver associado a outro cofre, o agente pede que você escolha antes de alterá-lo. [Detalhes por cliente](skills/obsidian/references/mcp.md)

### 2. Configuração e personalização

O agente cria sete pastas numeradas, um índice HOME.md, os templates de nota, diário e decisão e regras equivalentes em CLAUDE.md e AGENTS.md. A configuração preserva notas existentes e a pasta .obsidian. O agente mostra a árvore e pergunta quais são suas três áreas com mais anotações. Sua resposta define os nomes das pastas 10, 20 e 30 e atualiza os links e as rotas.

O Linter é opcional. Se quiser normalizar frontmatter ao salvar, instale esse plugin pelo próprio Obsidian.

### 3. Consulta automática

Em cada novo pedido substantivo, o agente segue as regras do projeto. A palavra-chave “trabalho”, por exemplo, leva diretamente à pasta 10-Trabalho até que você a personalize. O agente filtra pelo frontmatter, lê até cinco notas relevantes e cita os caminhos usados. Escritas dependem de um pedido seu.

Para testar, salve uma nota de decisão na pasta de trabalho e pergunte “Qual foi a decisão sobre esse projeto e em qual nota ela está?”. Você também pode pedir para pular a consulta.

## Claude no aplicativo ou site

[Prepare o ZIP para importar no Claude](downloads/README.md). Envie o arquivo fechado em **Customize → Skills → + → Create skill → Upload a skill** e ative a skill. [Guia da Anthropic](https://support.claude.com/en/articles/12512180-use-skills-in-claude)

O chat web pode consultar notas anexadas ou um conector disponível. Para configurar o MCP local e criar a estrutura no disco, abra um agente com terminal na pasta real do projeto. A importação do ZIP, por si só, não conecta o computador ao chat.

## Licença

[MIT](LICENSE). O repositório distribui a skill. Cada usuário escolhe o projeto e mantém suas notas localmente.
