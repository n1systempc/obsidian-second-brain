# Obsidian Second Brain

Use suas notas do Obsidian como contexto para agentes de código: projetos, preferências, decisões e conhecimento pessoal, com referências às notas consultadas.

Uma skill no padrão aberto [Agent Skills](https://agentskills.io/specification), independente de fornecedor. Funciona com leitura de Markdown local, arquivos disponibilizados no projeto ou uma conexão de notas já configurada. Não exige plugin do Obsidian, servidor MCP ou chave de API para ler um cofre local acessível.

## Instalar em um projeto

Na raiz do seu projeto, com Node.js 22.20 ou superior e npm disponíveis:

```sh
npx skills add n1systempc/obsidian-second-brain --skill obsidian-second-brain
```

O comando usa o instalador externo [Skills CLI](https://github.com/vercel-labs/skills). Escolha os agentes e o escopo de projeto no assistente. Revise as alterações antes de adicioná-las ao Git do seu projeto. O instalador tem seu próprio ciclo de versões e pode exigir acesso à rede.

### Instalação manual, sem npm

Baixe este repositório pelo GitHub (Code → Download ZIP) ou clone:

```sh
git clone https://github.com/n1systempc/obsidian-second-brain.git
```

Copie `SKILL.md` e `LICENSE` para uma pasta chamada `obsidian-second-brain` dentro do diretório apropriado do seu projeto:

| Agente | Caminho dentro do projeto |
| --- | --- |
| Claude Code | `.claude/skills/obsidian-second-brain/` |
| Codex | `.agents/skills/obsidian-second-brain/` |
| OpenCode | `.opencode/skills/obsidian-second-brain/` |
| Outros agentes com Agent Skills | Use o diretório de skills documentado pelo programa |

OpenCode também reconhece `.agents/skills` e `.claude/skills`. Evite instalar cópias duplicadas para o mesmo agente. Reabra a sessão caso a skill ainda não apareça. Os caminhos acima foram conferidos na documentação dos fornecedores; isso não significa teste de execução em cada aplicativo ou versão.

Para um agente sem suporte a Agent Skills, peça que leia o `SKILL.md` como instruções da tarefa, ou adapte seu conteúdo ao arquivo de regras aceito pelo programa. Isso é uso manual, sem garantia de descoberta automática. Editores sem agente de IA não executam skills.

## Conectar seu próprio cofre

Depois de instalar, diga ao agente:

> Use a skill obsidian-second-brain. Meu cofre está em /caminho/do/meu/cofre. Consulte as notas relevantes antes de responder a este pedido: [seu pedido].

No Windows, use seu caminho real, por exemplo `C:/Notas/MeuCofre`. Em Linux/macOS, use um caminho acessível ao agente. Se o agente estiver em um contêiner ou ambiente remoto, o cofre também precisa estar acessível nesse ambiente.

Como alternativa, configure a variável opcional `OBSIDIAN_VAULT_PATH` no ambiente que inicia o agente:

```powershell
# PowerShell: vale para esta sessão e seus processos filhos
$env:OBSIDIAN_VAULT_PATH = 'C:/Notas/MeuCofre'
```

```sh
# Bash/zsh: vale para esta sessão e seus processos filhos
export OBSIDIAN_VAULT_PATH='/caminho/do/meu/cofre'
```

A variável é uma convenção desta skill, não uma integração automática do Obsidian. Apps já abertos podem não herdá-la. Você também pode fornecer notas anexadas ou indicar uma conexão existente com acesso ao cofre. Cada usuário configura seu próprio acesso; instalar a skill não concede acesso às notas de outra pessoa.

## Consultar antes de cada pedido

Adicione o trecho abaixo às instruções persistentes do seu agente/projeto, preservando as regras existentes. Use `CLAUDE.md` no Claude Code ou `AGENTS.md` nos agentes que reconhecem esse arquivo. Para outros programas, consulte o formato de regras deles.

```markdown
Antes de cada novo pedido substantivo, use a skill obsidian-second-brain
para consultar notas relevantes do cofre configurado pelo usuário.
Reutilize contexto recente em continuações e respeite pedidos para não consultar.
Se o cofre não estiver acessível, informe uma vez e continue o trabalho independente.
Não publique notas, credenciais ou caminhos pessoais no repositório.
```

Defina o caminho do cofre localmente ou na conversa, sem colocá-lo nas instruções compartilhadas. Instruções persistentes orientam o agente, mas não garantem execução em todos os programas, modelos ou sessões.

## Exemplos

- “Consulte minhas notas sobre o projeto Atlas e resuma as decisões que afetam esta implementação.”
- “Procure minhas preferências de escrita e revise este texto seguindo as notas relevantes.”
- “Registre esta decisão na nota do projeto, preservando o frontmatter e os links.”

A consulta habitual é somente leitura. A escrita depende de um pedido para salvar, atualizar ou organizar. Sem acesso ao cofre, o agente deve dizer isso e não inventar lembranças.

## Privacidade e compartilhamento

Este repositório distribui as instruções da skill. Ele não sincroniza nem hospeda cofres. Mantenha notas, configurações pessoais e credenciais fora deste repositório público. Conceda ao agente apenas o acesso ao cofre que você pretende usar.

Para contribuir, abra uma issue ou pull request com exemplos fictícios. Não inclua notas privadas. Mudanças devem preservar a portabilidade, a escolha de cofre pelo usuário e a distinção entre consultar e editar.

## Referências de compatibilidade

- [Agent Skills: especificação](https://agentskills.io/specification)
- [Claude Code: skills](https://code.claude.com/docs/en/skills)
- [OpenCode: skills](https://opencode.ai/docs/skills/)
- [Codex: criação de skills](https://learn.chatgpt.com/docs/build-skills)
- [Skills CLI: instalação em agentes](https://github.com/vercel-labs/skills)

## Licença

MIT. Consulte [LICENSE](LICENSE).
