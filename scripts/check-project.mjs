import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function checkProject(directory='docs',{features=true}={}){
 const root=path.resolve(directory),assets=path.join(root,'assets');
 for(const name of ['index.html','.nojekyll','THIRD_PARTY_NOTICES.txt'])await access(path.join(root,name));
 const names=await readdir(assets);if(!names.length)throw Error('Empty docs/assets');
 const pending=['index.html'],seen=new Set(),scripts=[];
 while(pending.length){
  const name=pending.pop();if(seen.has(name))continue;seen.add(name);
  const file=path.resolve(root,name);if(!file.startsWith(root+path.sep))throw Error('Reference outside docs');
  const text=await readFile(file,'utf8');if(name.endsWith('.js'))scripts.push(text);
  const refs=name==='index.html'?[...text.matchAll(/(?:src|href)=["'](\.\/assets\/[^"']+)["']/g)].map(m=>m[1]):
   [...text.matchAll(/["'`](\.\/?[\w./-]+\.(?:js|css|svg))(?:\?[^"'`]*)?["'`]/g)].map(m=>m[1]);
  for(const ref of refs){const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),ref));await access(path.join(root,resolved));if(/\.(js|css)$/.test(resolved))pending.push(resolved);else seen.add(resolved)}
 }
 const stale=names.filter(n=>!seen.has('assets/'+n));if(stale.length)throw Error('Unreferenced assets: '+stale.join(', '));
 const bundle=scripts.join('\n');
 if(features){
  for(const ids of [['chapter-1','restore-light'],['chapter-2','missing-lights'],['chapter-3','third-light'],['chapter-4','ring-current','route:'],['trials','trial-','灯の試練'],['investigations','afterwind','灯路異変調査']])
   for(const id of ids)if(!bundle.includes(id))throw Error('Missing production feature: '+id);
  if(/LUMENFALL_EDITOR_DEV_ONLY|lumenfall-editor-draft|TransformControls/.test(bundle)||names.some(n=>/^editor[.-]/.test(n)))throw Error('Editor leaked into production');
 }
 return {assets:names.length,files:seen.size};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Project checks OK:',await checkProject());
