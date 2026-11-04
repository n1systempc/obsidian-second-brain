import { mkdir, readFile, writeFile, realpath, readdir, lstat } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';

if (!process.argv[2]) throw Error('Informe a raiz do projeto como argumento.');
const root = await realpath(resolve(process.argv[2]));
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
const rules = [
  begin, '## Memória do projeto', '',
  'Antes de cada novo pedido substantivo consulte as notas relevantes com a skill Obsidian. Reutilize contexto atual em continuações e respeite pedidos para pular a consulta.',
  '', '| Palavra-chave | Caminho direto |', '| --- | --- |',
  ...folders.map(([folder,key]) => `| ${key} | \`${folder}/\` |`),
  '', 'Se a palavra-chave estiver na tabela, vá direto à pasta. Dentro dela, use termos específicos. Sem rota, busque por título, tags ou alias antes de abrir notas. Leia o frontmatter primeiro, filtre por área, tipo e status e então leia até 3–5 notas relevantes. Cite a origem. Nunca leia o vault inteiro.',
  '', 'Escreva somente a pedido. Use uma nota atômica por conceito, arquivo em kebab-case sem acento, wikilinks [[assim]] e updated a cada alteração. Sem destino explícito, crie em 00-Inbox com status inbox.',
  '', 'Frontmatter obrigatório: id (YYYYMMDD-HHMM), title, area, type (nota, meeting, decisao, estudo, ideia ou daily), tags (lista), status (inbox, ativo ou arquivado), created e updated. Preencha valores reais ao criar a nota. Preserve o id nas edições e confira se já existe antes de reutilizar um identificador.', end
].join('\n');
async function create(name,content) {
  try { await writeFile(join(root,name),content+'\n',{flag:'wx'}); }
  catch(error) { if (error.code !== 'EEXIST') throw error; console.log('Preservado: '+name); }
}
for (const [folder] of folders) await mkdir(join(root,folder),{recursive:true});
for (const name of ['CLAUDE.md','AGENTS.md']) {
  let previous;
  try { previous = await readFile(join(root,name),'utf8'); }
  catch(error) { if(error.code !== 'ENOENT') throw error; }
  if(previous === undefined) await create(name,'# Instruções do projeto\n\n'+rules);
  else if(!previous.includes(begin) && !previous.includes(end))
    await writeFile(join(root,name),'\n\n'+rules+'\n',{flag:'a'});
  else {
    if(!previous.includes(begin) || !previous.includes(end)) throw Error('Bloco incompleto em '+name);
    console.log('Regras existentes preservadas: '+name);
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
console.log([basename(root)+'/',...folders.map(([folder])=> '  '+folder+'/'),
  ...templates.map(([name])=>'    '+name),'  CLAUDE.md','  AGENTS.md','  HOME.md'].join('\n'));
