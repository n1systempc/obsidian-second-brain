import { mkdir, readFile, writeFile, realpath, readdir, lstat } from 'node:fs/promises';
import { resolve, join, basename, relative, isAbsolute } from 'node:path';

if (!process.argv[2]) throw Error('Informe a raiz do projeto como argumento.');
const project = await realpath(resolve(process.argv[2]));
const requestedVault = resolve(project, process.argv[3] || 'vault');
try {
  const status = await lstat(requestedVault);
  if (!status.isDirectory() || status.isSymbolicLink()) throw Error('O vault deve ser uma pasta real: ' + requestedVault);
} catch (error) { if (error.code !== 'ENOENT') throw error; }
// An explicit external vault must already exist. Only the project-local default is created.
if (!process.argv[3]) await mkdir(requestedVault, { recursive: true });
const root = await realpath(requestedVault);
const folders = [
  ['00-Inbox', 'inbox', 'Notas aguardando classificação'],
  ['10-Trabalho', 'trabalho', 'Rotinas e decisões profissionais'],
  ['20-Estudos', 'estudos', 'Aprendizado e referências'],
  ['30-Projetos', 'projetos', 'Projetos em andamento'],
  ['50-Pessoal', 'pessoal', 'Vida pessoal'],
  ['70-Daily', 'daily', 'Diário e registros por dia'],
  ['99-Templates', 'templates', 'Modelos de notas']
];
const existing = await readdir(root);
for (const entry of folders.slice(1,4)) {
  const candidates = existing.filter(name => name.startsWith(entry[0].slice(0,3)));
  if (candidates.length > 1) throw Error('Área ambígua: ' + candidates.join(', '));
  if (candidates.length && candidates[0] !== entry[0]) {
    entry[0] = candidates[0];
    entry[1] = entry[0].slice(3).toLowerCase();
    entry[2] = 'Notas de ' + entry[0].slice(3);
  }
}
const templates = [['_nota.md','nota','Conteúdo'],['_daily.md','daily','Registro do dia'],['_decisao.md','decisao','Decisão']];
const fileNames = ['CLAUDE.md','AGENTS.md','HOME.md', ...templates.map(([name]) => '99-Templates/'+name)];
async function inspect(name, directory) {
  try {
    const status = await lstat(join(root,name));
    if (directory ? !status.isDirectory() : !status.isFile() || status.nlink > 1)
      throw Error('Destino incompatível: ' + name);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
for (const [folder] of folders) await inspect(folder,true);
for (const name of fileNames) await inspect(name,false);
const begin = '<!-- obsidian:inicio -->', end = '<!-- obsidian:fim -->';
const instructionPaths = [...new Set([join(project,'CLAUDE.md'), join(project,'AGENTS.md'), join(root,'CLAUDE.md'), join(root,'AGENTS.md')])];
for (const path of instructionPaths) {
  try {
    const status = await lstat(path);
    if (!status.isFile() || status.nlink > 1) throw Error('Destino incompatível: ' + path);
    const text = await readFile(path,'utf8');
    const start = text.indexOf(begin), finish = text.indexOf(end);
    if ((start >= 0 || finish >= 0) && (start < 0 || finish < start || text.indexOf(begin,start+begin.length)>=0 || text.indexOf(end,finish+end.length)>=0))
      throw Error('Bloco de regras incompleto ou duplicado em ' + path);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
function vaultPath(base) {
  const path = relative(base,root);
  return (isAbsolute(path) || path.startsWith('..') ? root : path || '.').replaceAll('\\','/');
}
const rules = (base) => [
  begin, '## Memória do projeto', '',
  'Vault configurado: `' + vaultPath(base) + '`. Resolva os caminhos abaixo a partir da pasta deste arquivo. Use o MCP somente se ele apontar para este vault; caso contrário, leia os arquivos locais autorizados.', '',
  'Antes de cada novo pedido substantivo consulte as notas relevantes com a skill Obsidian. Reutilize contexto atual em continuações e respeite pedidos para pular a consulta.',
  '', '| Palavra-chave | Caminho direto |', '| --- | --- |',
  ...folders.map(([folder,key]) => `| ${key} | \`${vaultPath(base)}/${folder}/\` |`),
  '', 'Se a palavra-chave estiver na tabela, vá direto à pasta. Dentro dela, use termos específicos. Sem rota, busque por título, tags ou alias antes de abrir notas. Leia o frontmatter primeiro, filtre por área, tipo e status e então leia até 3–5 notas relevantes. Cite a origem. Nunca leia o vault inteiro.',
  '', 'Escreva somente a pedido. Use uma nota atômica por conceito, arquivo em kebab-case sem acento, wikilinks [[assim]] e updated a cada alteração. Sem destino explícito, crie em 00-Inbox dentro do vault com status inbox.',
  '', 'Frontmatter obrigatório: id (YYYYMMDD-HHMM), title, area, type (nota, meeting, decisao, estudo, ideia ou daily), tags (lista), status (inbox, ativo ou arquivado), created e updated. Preencha valores reais ao criar a nota. Preserve o id nas edições e confira se já existe antes de reutilizar um identificador.', end
].join('\n');
async function create(name,content) {
  try { await writeFile(join(root,name),content+'\n',{flag:'wx'}); }
  catch(error) { if (error.code !== 'EEXIST') throw error; console.log('Preservado: '+name); }
}
for (const [folder] of folders) await mkdir(join(root,folder),{recursive:true});
for (const path of instructionPaths) {
  let previous;
  try { previous = await readFile(path,'utf8'); }
  catch(error) { if(error.code !== 'ENOENT') throw error; }
  const base = resolve(path,'..');
  const content = rules(base);
  if(previous === undefined) await writeFile(path,'# Instruções do projeto\n\n'+content+'\n',{flag:'wx'});
  else if(!previous.includes(begin) && !previous.includes(end))
    await writeFile(path,'\n\n'+content+'\n',{flag:'a'});
  else {
    const start = previous.indexOf(begin), finish = previous.indexOf(end)+end.length;
    const updated = previous.slice(0,start)+content+previous.slice(finish);
    if (updated !== previous) await writeFile(path,updated);
  }
}
await create('HOME.md',['# Índice do vault','',...folders.map(([folder,,description]) =>
  `- [${folder}](<./${folder}/>) — ${description}`)].join('\n'));
for(const [name,type,section] of templates) {
  const content = ['---','id: "{{date:YYYYMMDD}}-{{time:HHmm}}"','title: "{{title}}"','area: ""',
    'type: '+type,'tags: []','status: '+(type==='nota'?'inbox':'ativo'),
    'created: "{{date:YYYY-MM-DD}}"','updated: "{{date:YYYY-MM-DD}}"','---','',
    '# {{title}}','','## '+section,'',...(type==='decisao'?['## Motivo','','## Consequências','']:[]),'## Notas relacionadas'];
  await create('99-Templates/'+name,content.join('\n'));
}
console.log('Projeto: '+project+'\nVault: '+root+'\nRegras: '+instructionPaths.join(', '));
console.log([basename(root)+'/',...folders.map(([folder])=> '  '+folder+'/'),
  ...templates.map(([name])=>'    '+name),'  CLAUDE.md','  AGENTS.md','  HOME.md'].join('\n'));
