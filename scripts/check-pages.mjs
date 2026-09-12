import {readFile,readdir,access} from 'node:fs/promises';
const html=await readFile('docs/index.html','utf8');let checked=0;
for(const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)){await access('docs/'+match[1]);checked++}
for(const file of await readdir('docs/assets'))if(file.endsWith('.js')){const text=await readFile('docs/assets/'+file,'utf8');for(const match of text.matchAll(/["'](?:\.\/)?([\w-]+\.(?:js|css))["']/g)){await access('docs/assets/'+match[1]);checked++}}
const scripts=await Promise.all((await readdir('docs/assets')).filter(f=>f.endsWith('.js')).map(f=>readFile('docs/assets/'+f,'utf8')));if(!scripts.some(s=>s.includes('無音の環海'))||!scripts.some(s=>s.includes('route:')))throw Error('Chapter 4 build missing');console.log(`Pages references OK: ${checked}; Chapter 4 content included`);
