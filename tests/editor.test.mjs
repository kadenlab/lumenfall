import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {editorEnabled,validateDocument,updateObject,moveObject,addDraft,deleteObject,exportJSON,exportTS,saveDraft,loadDraft,clearDraft,teleportPayload,DRAFT_KEY} from '../app/editor/model.ts';
import {buildEditorScene,editorChapters} from '../app/editor/scene-adapter.ts';
import {loadChapter} from '../app/chapters/registry.ts';
const document=()=>({version:1,chapterId:'chapter-1',mapId:0,objects:[{id:'player-start',kind:'player-start',name:'Player Start',x:1,z:2,source:'existing'}]});
test('Editor requires development and explicit editor=1; entry import is DEV guarded',async()=>{
 for(const dev of [false,true])for(const search of ['', '?editor=0','?editor=1','?debug=1'])assert.equal(editorEnabled(dev,search),dev&&search==='?editor=1');
 const entry=await readFile(new URL('../standalone/main.ts',import.meta.url),'utf8');assert.match(entry,/if\(import\.meta\.env\.DEV&&[^\n]+import\('\.\.\/app\/editor\/index'\)/);
});
test('Editor coordinate validation is atomic and movement snaps X/Z',()=>{
 const d=document();moveObject(d,'player-start',1.36,-2.26,.5);assert.deepEqual([d.objects[0].x,d.objects[0].z],[1.5,-2.5]);
 for(const snap of [.25,1]){moveObject(d,'player-start',1.36,-2.26,snap);assert.equal(d.objects[0].x/snap,Math.round(1.36/snap))}
 moveObject(d,'player-start',1.36,-2.26,0);assert.equal(d.objects[0].x,1.36);
 const before=exportJSON(d);for(const patch of [{x:NaN},{z:Infinity},{radius:-1},{x:10001}])assert.throws(()=>updateObject(d,'player-start',patch));assert.equal(exportJSON(d),before);
});
test('Draft add/delete unique IDs and existing removal confirmation',()=>{
 const d=document();for(const kind of ['npc','enemy','chest','prop']){const a=addDraft(d,kind),b=addDraft(d,kind);assert.notEqual(a.id,b.id);deleteObject(d,a.id);assert.ok(!d.objects.includes(a))}
 assert.throws(()=>deleteObject(d,'player-start'));deleteObject(d,'player-start',true);assert.throws(()=>addDraft(d,'boss'));
});
test('JSON export strips helpers and TS preserves placement metadata without executable names',()=>{
 const d=document(),o=addDraft(d,'enemy');o.name='"; throw Error("bad"); //';o.metadata={gameId:'enemy-1',sprite:'sentinel',scale:2,destination:1};o.helper='not exported';
 const round=JSON.parse(exportJSON(d));assert.equal(round.objects[1].helper,undefined);assert.equal(round.objects[1].name,o.name);
 const ts=exportTS(d);assert.match(ts,/needsDefinition/);assert.match(ts,/sentinel/);assert.match(ts,/playerStart/);
 // The generated snippet contains only constant data and can safely be parsed as JavaScript.
 const values=Function(ts.replaceAll('export const','const')+';return {worldObjects,playerStart,placementMetadata};')();assert.equal(values.worldObjects[0].name,o.name);assert.equal(values.placementMetadata[0].needsDefinition,true);
 assert.deepEqual(JSON.parse(teleportPayload(d,o.id)),{chapterId:'chapter-1',mapId:0,x:0,z:0});
 assert.throws(()=>validateDocument({...d,objects:[d.objects[0],d.objects[0]]}));
});
test('Editor storage never touches normal or DEBUG saves; malformed drafts rejected',()=>{
 const values=new Map([['lumenfall-save','normal bytes'],['lumenfall-debug-save','debug bytes']]);const keys=[];
 const storage={setItem(k,v){keys.push(k);values.set(k,v)},getItem(k){keys.push(k);return values.get(k)??null},removeItem(k){keys.push(k);values.delete(k)}};
 saveDraft(storage,document());assert.deepEqual(loadDraft(storage),document());clearDraft(storage);assert.equal(loadDraft(storage),null);
 assert.ok(keys.every(k=>k===DRAFT_KEY));assert.equal(values.get('lumenfall-save'),'normal bytes');assert.equal(values.get('lumenfall-debug-save'),'debug bytes');
 values.set(DRAFT_KEY,'{"version":9}');assert.throws(()=>loadDraft(storage));
});
for(const meta of editorChapters())test(`Editor scenery adapter: all ${meta.id} maps load without game storage`,async()=>{
 const chapter=await loadChapter(meta.id);
 for(const map of chapter.maps){const scene=await buildEditorScene(meta.id,map.id);try{
  assert.equal(scene.document.mapId,map.id);assert.equal(scene.document.objects[0].kind,'player-start');validateDocument(scene.document);
  if(meta.id==='chapter-1')assert.ok(scene.document.objects.some(o=>o.kind==='chest'));
  if(meta.id==='chapter-4'&&map.id===7)assert.ok(scene.document.objects.some(o=>o.kind==='boss'));
  for(const b of scene.blocks)assert.ok([b.x,b.z,b.w,b.d].every(Number.isFinite),`${meta.id}/${map.id} block`);
  scene.scene.traverse(o=>{assert.ok([o.position.x,o.position.y,o.position.z].every(Number.isFinite),`${meta.id}/${map.id} mesh position`)});
 }finally{scene.dispose()}}
});
