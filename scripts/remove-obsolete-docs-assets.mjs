// Run after overlaying this ZIP on the repository checkout. No recursive deletion.
import {readFile,lstat,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(root,'docs','assets');
const obsolete=JSON.parse(await readFile(path.join(root,'docs-dev','OBSOLETE_DOCS_ASSETS.json'),'utf8'));
const pending=[];
for(const {name,sha256} of obsolete){
 if(!/^[A-Za-z0-9_.-]+\.(js|css|svg)$/.test(name))throw Error('Invalid asset name');
 const file=path.resolve(assets,name);
 if(path.dirname(file)!==assets)throw Error('Asset is outside docs/assets');
 let stat;try{stat=await lstat(file)}catch(e){if(e.code==='ENOENT')continue;throw e}
 if(!stat.isFile()||stat.isSymbolicLink())throw Error('Not a regular generated file: '+name);
 const actual=createHash('sha256').update(await readFile(file)).digest('hex');
 if(actual!==sha256)throw Error('File changed; review before removing: '+name);
 pending.push(file);
}
for(const file of pending)await unlink(file);
console.log(`Removed ${pending.length} verified obsolete docs assets.`);
