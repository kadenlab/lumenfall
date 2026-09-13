import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chapterCatalog,defineCatalog,ancestors,successors} from '../app/chapters/catalog.ts';
import {loadChapter} from '../app/chapters/registry.ts';
import {fresh} from '../app/systems/state.ts';
import {progress} from '../app/systems/progression.ts';
import {migrateChapterUnlocks,canAccessChapter} from '../app/systems/chapter-unlocks.ts';
import {encode,decode,SAVE_VERSION} from '../app/systems/save.ts';
import {presets,travel} from '../app/debug/debug-actions.ts';
test('catalog order, IDs and prerequisites are explicit; no Chapter 5 installed',()=>{
 assert.deepEqual(chapterCatalog.map(c=>c.id),[1,2,3,4].map(n=>'chapter-'+n));
 assert.deepEqual(chapterCatalog.map(c=>c.order),[1,2,3,4]);
 assert.deepEqual(ancestors('chapter-4'),['chapter-1','chapter-2','chapter-3']);
 assert.ok(!ancestors('chapter-4').includes('trials'));
});
test('future 5–10 metadata contract works without loading any content',()=>{
 let loads=0;const future=Array.from({length:6},(_,i)=>({...chapterCatalog[3],id:'chapter-'+(i+5),order:i+5,requires:'chapter-'+(i+4),load:()=>{loads++;throw Error('must stay lazy')}}));
 const catalog=defineCatalog([...future.reverse(),...chapterCatalog]);
 assert.deepEqual(successors('chapter-4',catalog),['chapter-5']);
 assert.equal(ancestors('chapter-10',catalog).length,9);assert.equal(loads,0);
 const s=fresh();progress(s.campaign,'chapter-4').completed=true;migrateChapterUnlocks(s,catalog);assert.ok(s.campaign.unlockedChapters.includes('chapter-5'));assert.ok(!s.campaign.unlockedChapters.includes('chapter-6'));assert.equal(loads,0);
});
test('catalog rejects duplicate IDs/orders and missing or cyclic prerequisites',()=>{
 assert.throws(()=>defineCatalog([...chapterCatalog,chapterCatalog[0]]));
 assert.throws(()=>defineCatalog([{...chapterCatalog[0],requires:'missing'}]));
 assert.throws(()=>defineCatalog([{...chapterCatalog[0],requires:'chapter-1'}]));
});
for(let n=1;n<4;n++)test(`Chapter ${n} completion unlocks ${n+1} without trials`,()=>{
 const s=fresh();migrateChapterUnlocks(s);assert.equal(canAccessChapter(s,'chapter-'+(n+1)),false);
 progress(s.campaign,'chapter-'+n).completed=true;migrateChapterUnlocks(s);
 assert.ok(s.campaign.unlockedChapters.includes('chapter-'+(n+1)));assert.equal(s.trials.unlocked,false);
});
for(const meta of chapterCatalog){
 test(meta.id+' lazy load matches metadata and debug definition',async()=>{
 const pack=await loadChapter(meta.id);assert.equal(pack.title,meta.title);assert.deepEqual(pack.start,meta.start);assert.deepEqual(pack.unlockNext,successors(meta.id));
 assert.deepEqual(presets[meta.id].names,(await meta.debug()).names);
 for(const [area,name] of Object.entries(presets[meta.id].mapGates)){assert.ok(pack.maps.some(m=>m.id===+area));assert.ok(presets[meta.id].names.includes(name))}
 });
 test(meta.id+' cleared map travel and reload preserve progress and player inventory',async()=>{
 let s=await travel(fresh(),meta.id,undefined,'Cleared');s.gold=789;s.potions=12;s.ethers=9;
 const old=structuredClone(progress(s.campaign));const pack=await loadChapter(meta.id);
 for(const map of pack.maps){s=await travel(s,meta.id,map.id);assert.equal(progress(s.campaign).completed,true);assert.deepEqual(progress(s.campaign).flags,old.flags);assert.deepEqual(progress(s.campaign).chests,old.chests)}
 const restored=decode(JSON.stringify(encode(s)));assert.equal(restored.gold,789);assert.equal(restored.potions,12);assert.equal(restored.ethers,9);assert.equal(progress(restored.campaign).completed,true);assert.equal(SAVE_VERSION,2);
 });
}
test('catalog only uses dynamic imports for story and DEBUG definitions',async()=>{
 const source=await readFile(new URL('../app/chapters/catalog.ts',import.meta.url),'utf8');
 assert.ok(!/^import (?!type).*from ['"].*(chapter-config|presets)/m.test(source));
 const debug=await readFile(new URL('../app/debug/debug.ts',import.meta.url),'utf8');assert.ok(!debug.includes("id==='chapter-"));
});
test('Pages rebuild never restores historical root source over app',async()=>{
 const workflow=await readFile(new URL('../.github/workflows/repair-chapter3-pages.yml',import.meta.url),'utf8');
 assert.ok(!workflow.includes('cp -R chapters'));assert.ok(!workflow.includes('rm -rf app'));assert.ok(workflow.includes('npm test'));assert.ok(workflow.includes('npm run build'));assert.ok(workflow.includes('workflow_dispatch:'));
});
test('copyable template loads, enforces prerequisite and builds a valid spawn floor',async()=>{
 const {mkdtemp,mkdir,writeFile,rm}=await import('node:fs/promises');
 const {pathToFileURL,fileURLToPath}=await import('node:url');
 const dir=await mkdtemp(fileURLToPath(new URL('../app/chapters/template-check-',import.meta.url)));
 const id='template-contract';
 try{
  await mkdir(dir+'/maps');
  for(const file of ['chapter-config.ts','map-config.ts','maps/entry.ts','debug.ts']){
   const source=await readFile(new URL('../templates/chapter/'+file+'.template',import.meta.url),'utf8');
   await writeFile(dir+'/'+file,source.replaceAll('__CHAPTER_ID__',id));
  }
  chapterCatalog.push({...chapterCatalog[3],id,title:'Template contract',order:99,requires:'chapter-4',start:{area:0,x:0,z:8},load:()=>import(pathToFileURL(dir+'/chapter-config.ts').href),debug:()=>import(pathToFileURL(dir+'/debug.ts').href)});
  const chapter=await loadChapter(id),s=fresh();s.campaign.currentChapter=id;
  assert.throws(()=>chapter.initialize(s));progress(s.campaign,'chapter-4').completed=true;chapter.initialize(s);
  assert.ok(chapter.walkable(s,chapter.start.x,chapter.start.z));
  const map=await chapter.maps[0].load();let boxes=0;map.build({box(){boxes++},mat(){return {}}});assert.equal(boxes,1);
  assert.ok((await chapterCatalog.at(-1).debug()).names.includes('Start'));
 }finally{const index=chapterCatalog.findIndex(c=>c.id===id);if(index>=0)chapterCatalog.splice(index,1);await rm(dir,{recursive:true,force:true})}
});
