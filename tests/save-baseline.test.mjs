import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from '../app/systems/state.ts';
import {travel} from '../app/debug/debug-actions.ts';
import {decode,encode,readSave,writeSave} from '../app/systems/save.ts';
import {debugStorage} from '../app/debug/gate.ts';
import {startCase,scan} from '../app/investigations/state.ts';
import {claim} from '../app/investigations/rewards.ts';

// Scenario fixtures use public transitions, then keep distinctive persisted values.
async function fixture(kind){
 let s=kind==='new'?fresh():await travel(fresh(),kind.startsWith('chapter-')?kind:'chapter-4',undefined,'Cleared');
 s.lv=15;s.hp=223;s.mp=77;s.xp=123;s.gold=789;s.potions=8;s.ethers=9;
 if(kind==='trials'||kind==='gear'){s.trials.cleared=[1,2,3,4,5];s.trials.unlockedTrials=[1,2,3,4,5];s.trials.owned=['warden','eternal'];s.trials.slots=['warden','eternal']}
 if(kind==='gear')s.gear={owned:['still-blade','ringkeeper-robes'],weapon:'still-blade',armor:'ringkeeper-robes'};
 if(kind==='investigations-progress'){startCase(s,1);scan(s,0);scan(s,1)}
 if(kind==='investigations-complete')for(let id=0;id<4;id++){startCase(s,id);for(let i=0;i<3;i++)scan(s,i);claim(s,id)}
 return s;
}
for(const kind of ['new','chapter-1','chapter-2','chapter-3','chapter-4','trials','gear','investigations-progress','investigations-complete']){
 test('stable save fixture roundtrip: '+kind,async()=>{
  const s=await fixture(kind),data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
  writeSave(storage,s);const normal=data.get('lumenfall-save');
  assert.deepEqual(readSave(storage),s);
  const debug=structuredClone(s);debug.gold++;writeSave(debugStorage(storage),debug);
  assert.deepEqual(readSave(debugStorage(storage)),debug);assert.equal(data.get('lumenfall-save'),normal);
 });
}
test('legacy Chapter 3 completion without investigation/gear namespaces preserves story and inventory',async()=>{
 const s=await fixture('chapter-3');delete s.investigations;delete s.gear;
 const n=decode(JSON.stringify(encode(s)));
 assert.deepEqual(n.campaign.chapters,s.campaign.chapters);
 assert.ok(n.campaign.unlockedChapters.includes('chapter-4'));
 for(const k of ['lv','xp','gold','hp','mp','potions','ethers'])assert.equal(n[k],s[k]);
});
