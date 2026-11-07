# Obsidian Second Brain

Use uma pasta `vault/` dentro do projeto para decisões, estudos e notas de trabalho, ou vincule um vault externo compartilhado. O fluxo registra o MCP no agente local, configura o vault e cria instruções na raiz do projeto para consultar as notas antes de responder.

## Começar no Claude Code, Codex ou OpenCode

Na raiz do projeto, instale a skill com Node.js 22.20 ou superior e npm:

```sh
npx skills add n1systempc/obsidian-second-brain --skill obsidian
```

Escolha seu agente e a instalação por projeto. Abra uma sessão no mesmo projeto. Se quiser instalar manualmente, copie a pasta inteira [skills/obsidian](skills/obsidian) para `.claude/skills/` no Claude Code, `.agents/skills/` no Codex ou `.opencode/skills/` no OpenCode. A distribuição com o nome anterior `obsidian-second-brain` continua disponível com o mesmo fluxo. Instale apenas um dos nomes.

Para disponibilizar a skill em vários projetos, acrescente `-g` ao comando de instalação e escolha o agente. Depois execute o pedido de configuração em cada projeto. As regras de consulta ficam no projeto atual, inclusive quando as notas estão em outro local.

| Cliente | Pedido no chat do projeto |
| --- | --- |
| Claude Code | `/obsidian install` |
| Codex | `$obsidian install` |
| OpenCode ou cliente sem atalho de skill | `Use a skill obsidian para instalar e configurar o vault deste projeto.` |

O pedido acima é feito ao agente. Ele usa o terminal da sessão para configurar o servidor.

### 1. Instalação do MCP

Na primeira instalação, o agente procura `vault/` na raiz do projeto e cria a pasta quando ela estiver ausente. Resolve seu caminho absoluto e registra o servidor [@bitbonsai/mcpvault](https://github.com/bitbonsai/mcpvault) com `claude mcp add obsidian -- npx -y @bitbonsai/mcpvault "<projeto>/vault"` ou o equivalente `codex mcp add`. No OpenCode ele usa a configuração MCP local. Se o nome estiver associado a outro cofre, o agente pede que você escolha antes de alterá-lo. [Detalhes por cliente](skills/obsidian/references/mcp.md)

Para compartilhar um vault externo, peça “Use a skill obsidian para configurar este projeto com o vault existente em C:/Notas/vault”. A skill mantém essa escolha nas instruções do projeto. O MCP deve apontar para essa mesma pasta. No Codex, confira conflitos com outros projetos porque o registro pelo CLI pode ter escopo de usuário.

### 2. Configuração e personalização

O agente cria sete pastas numeradas, um índice HOME.md e os templates de nota, diário e decisão dentro do vault. Cria regras equivalentes em CLAUDE.md e AGENTS.md na raiz do projeto e no vault, com caminhos adequados a cada local. A configuração preserva notas existentes e a pasta .obsidian. O agente mostra a árvore e pergunta quais são suas três áreas com mais anotações. Sua resposta define os nomes das pastas 10, 20 e 30 e atualiza os links e as rotas.

```text
meu-projeto/
├── AGENTS.md
├── CLAUDE.md
└── vault/
    ├── 00-Inbox/
    ├── 10-Trabalho/
    ├── 20-Estudos/
    ├── 30-Projetos/
    ├── 50-Pessoal/
    ├── 70-Daily/
    ├── 99-Templates/
    ├── AGENTS.md
    ├── CLAUDE.md
    └── HOME.md
```

Em projetos configurados por versões anteriores, com as notas na própria raiz, o agente pergunta como reutilizar ou migrar a estrutura antes de prosseguir.

O Linter é opcional. Se quiser normalizar frontmatter ao salvar, instale esse plugin pelo próprio Obsidian.

### 3. Consulta automática

Em cada novo pedido substantivo, o agente segue as regras da raiz do projeto. A palavra-chave “trabalho”, por exemplo, leva diretamente a `vault/10-Trabalho/` até que você a personalize. Para um vault externo, a rota aponta para o local escolhido. O agente filtra pelo frontmatter, lê até cinco notas relevantes e cita os caminhos usados. Pode usar leitura local autorizada quando o MCP estiver indisponível. Escritas dependem de um pedido seu.

Para testar, salve uma nota de decisão na pasta de trabalho e pergunte “Qual foi a decisão sobre esse projeto e em qual nota ela está?”. Você também pode pedir para pular a consulta.

## Claude no aplicativo ou site

[Prepare o ZIP para importar no Claude](downloads/README.md). Envie o arquivo fechado em **Customize → Skills → + → Create skill → Upload a skill** e ative a skill. [Guia da Anthropic](https://support.claude.com/en/articles/12512180-use-skills-in-claude)

O chat web pode consultar notas anexadas ou um conector disponível. Para configurar o MCP local e criar a estrutura no disco, abra um agente com terminal na pasta real do projeto. A importação do ZIP, por si só, não conecta o computador ao chat.

## Licença

[MIT](LICENSE). O repositório distribui a skill. Cada usuário escolhe o projeto e mantém suas notas localmente.
