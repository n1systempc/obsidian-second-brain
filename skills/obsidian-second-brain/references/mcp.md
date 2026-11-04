# Registro local do servidor obsidian

Confira a presença do CLI do cliente, Node.js e npx. Use a raiz absoluta real do projeto como um único argumento. Os exemplos abaixo usam uma variável de shell POSIX; no PowerShell resolva a raiz com `(Resolve-Path -LiteralPath .).Path` a partir do projeto e passe esse valor como argumento. O separador `--` pertence ao CLI, não ao comando salvo do servidor.

Inspecione o registro existente antes de adicionar. Compare transporte, executável, pacote e caminho do vault. Reutilize um registro equivalente. Se o mesmo nome aponta para outro vault ou serviço, não substitua silenciosamente: explique o conflito e peça a escolha do usuário. No Codex, o registro feito pelo CLI pode valer para outras sessões do usuário.

**Claude Code** (escopo local do projeto por padrão):

```sh
claude mcp get obsidian
claude mcp add obsidian -- npx -y @bitbonsai/mcpvault "$VAULT"
claude mcp get obsidian
```

**Codex**:

```sh
codex mcp get obsidian
codex mcp add obsidian -- npx -y @bitbonsai/mcpvault "$VAULT"
codex mcp get obsidian
```

No Windows nativo, se o cliente não iniciar o shim npx, use o binário node com o caminho absoluto verificado do npx-cli.js da instalação do npm, seguido de `-y`, pacote e vault como argumentos separados. Evite montar uma linha cmd.exe com caminhos fornecidos pelo usuário. No WSL use o Node, o CLI e o caminho do projeto do próprio WSL.

**OpenCode**: na configuração de projeto efetiva (opencode.json ou opencode.jsonc), mescle somente a entrada mcp.obsidian, preservando chaves e comentários. Use `{"type":"local","command":["npx","-y","@bitbonsai/mcpvault","<raiz absoluta real>"],"enabled":true}`. Confira com `opencode mcp list`. A configuração do MCP é a única configuração de cliente desta etapa.

Após registrar, confira as ferramentas anunciadas pelo cliente e faça uma leitura limitada da raiz, quando disponível. Distinga registro gravado de conexão testada. Se o cliente só recarrega servidores na próxima sessão, instrua a reabrir o projeto. Falha ao baixar o pacote ou iniciar o processo deve ser mostrada ao usuário. Não inicie uma segunda instalação durante a consulta normal.
