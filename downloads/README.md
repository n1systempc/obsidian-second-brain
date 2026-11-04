# Importar no Claude

Para gerar o ZIP da versão pública com Git, execute estes comandos no terminal:

```sh
git clone https://github.com/n1systempc/obsidian-second-brain.git
git -C obsidian-second-brain archive --format=zip --prefix=obsidian/ --output=../obsidian.zip HEAD:skills/obsidian
```

O arquivo `obsidian.zip` fica ao lado da pasta clonada. No aplicativo ou site do Claude, envie o ZIP fechado em **Customize → Skills → + → Create skill → Upload a skill**. Depois ative a skill.

Para criar o vault no computador, abra o Claude Code dentro do projeto e execute `/obsidian install`.
