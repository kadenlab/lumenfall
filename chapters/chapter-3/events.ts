import type {ChapterContext,WorldObject} from '../types.ts';
import {completeChapter} from '../../systems/progression.ts';
import {flags,won,canEnter,ready} from './state.ts';
import {dialogue} from './dialogue-config.ts';
import {placements,treasures} from './object-config.ts';
export function begin(c:ChapterContext){flags(c.state).arrived=true;c.modal='chapter3-title';c.save();c.renderUI()}
export function goal(c:ChapterContext){const f=flags(c.state);let id='';if(c.progress.completed)return c.objects.find(o=>o.id==='memory');
 if(won(c.state,'aurel'))id='echo';
 else if(c.state.area===0)id=!f.traveler?'traveler':!won(c.state,'frost')?'frost':!f.waylight?'waylight':'village';
 else if(c.state.area===1)id=!f.history?'elder':!f.smith?'smith':!f.watcher?'watcher':!won(c.state,'warden')?'warden':'city';
 else if(c.state.area===2)id=!won(c.state,'soldier')?'soldier':!won(c.state,'shade')?'shade':!f.evidence?'memory':'cathedral';
 else if(c.state.area===3)id=!f.record?'record':!won(c.state,'hunter')?'hunter':!f['hearth-west']?'hearth-west':!f['hearth-east']?'hearth-east':'furnace';
 else id='aurel';return c.objects.find(o=>o.id===id)}
export function ending(c:ChapterContext){const f=flags(c.state);if(c.progress.completed){c.talk('観測盤',dialogue.final);return}
 // Every phase can be replayed safely after a load: boss defeat is already saved.
 c.talk('氷葬の灯守',dialogue.truth,()=>{f.rekindled=true;c.build();c.save();c.talk('大灯へ火を分ける',dialogue.thaw,()=>{void c.transition(2).then(()=>{
  const light=(n:number)=>{f.cityLights=n;c.build();c.save();c.talk(n===3?'オル':'帰ってくる灯',[dialogue.cityLight[n-1]],()=>n<3?light(n+1):mapEnding(c))};light(1);
 }).catch(()=>{})})})}
function mapEnding(c:ChapterContext){const f=flags(c.state);f.worldMap=true;c.build();c.save();c.talk('世界の灯',dialogue.final,()=>{f.nextLight='silent-ring';f.endingComplete=true;c.progress.quests['third-light']='complete';completeChapter(c.state.campaign,['chapter-4']);c.save();c.finish()})}
export function interact(c:ChapterContext,o:WorldObject){const s=c.state,f=flags(s);
 if(o.kind==='previous'){void c.switchChapter('chapter-2').catch(e=>c.notify(e.message));return}
 if(o.kind==='shop'){c.modal='shop';c.renderUI();return}
 if(o.kind==='spring'){s.hp=c.maxHP();s.mp=c.maxMP();c.save();c.talk(o.name,['小さな火を囲み、身体を温めた。HP・MPが全回復した。ここでは何度でも休める。']);return}
 if(o.kind==='npc'){let lines=dialogue[o.id];if(o.id==='elder'){if(!f.history){f.history=true;s.potions+=4;s.ethers+=5;c.progress.quests['third-light']='gate'}else lines=['大灯を頼むよ。暖炉はいつでも使っておくれ。',...dialogue.elder.slice(0,3)]}else f[o.id]=true;c.save();c.talk(o.name,lines);return}
 if(o.kind==='chest'){if(c.progress.chests.includes(o.id)){c.notify('宝箱は空っぽだ');return}const t=treasures[o.id];if(!t)return;c.progress.chests.push(o.id);s.gold+=t.gold;s.potions+=t.potions;s.ethers+=t.ethers;c.build();c.save();c.talk('宝箱',[`${t.gold}G・薬草${t.potions}個・星の雫${t.ethers}個を手に入れた。`]);return}
 if(o.kind==='lore'){
  if(o.id==='memory'){if(!won(s,'soldier')||!won(s,'shade')){c.talk('ミナ',['凍灯兵と亡影が装置を覆っている。先に鎮めよう。']);return}f.evidence=true;c.progress.quests['third-light']='sanctuary';c.talk('消灯装置の痕跡',dialogue.evidence)}
  else{f.record=true;c.talk('聖堂の記録',dialogue.record)}c.save();return;
 }
 if(o.kind==='lamp'){
  if(o.id==='waylight'&&!won(s,'frost')||o.id==='hearth-west'&&!won(s,'hunter')){c.talk('ミナ',['灯を狙う魔物を、先に鎮めよう。']);return}
  if(f[o.id]){c.talk(o.name,['分けた灯が、静かに雪を照らしている。']);return}f[o.id]=true;c.build();c.save();c.burst(o.x,c.height(o.x,o.z)+1.8,o.z,'#ffe4b4',55);c.talk('ミナ',[o.id==='waylight'?'道標が灯った。集落への石道が見える。':ready(s)?'左右の灯がつながった。炉心への道が開いた。':'保温灯が灯った。もう一方の火と、中央の記録も確かめよう。']);return;
 }
 if(o.kind==='exit'){const dest=placements[s.area].find(p=>p.id===o.id)!.destination!;
  if(dest===1&&s.area===0&&!f.waylight){c.talk('ミナ',['雪原の道標を灯してから、集落へ向かおう。']);return}
  if(!canEnter(s,dest)){c.talk('ミナ',[dest===2?'番人を鎮めれば旧都へ進める。先に集落の三人に話を聞こう。':dest===3?'旧都の消灯装置を調べよう。': '記録を読み、左右の保温灯を点けよう。']);return}void c.transition(dest).catch(()=>{});return;
 }
 if(o.kind==='ending'){ending(c);return}
 if(o.kind==='enemy'||o.kind==='boss'){
  if(o.id==='warden'&&(!f.history||!f.smith||!f.watcher)){c.talk('ミナ',['先にオル、ユル、ネムから話を聞こう。']);return}
  if(o.id==='aurel'){c.talk('黒い氷の亀裂',dialogue.beforeBoss,()=>{for(const ice of c.world.userData.blackIce??[])ice.visible=false;c.burst(0,2,-11,'#c4eeff',100);c.startBattle(o)})}else c.startBattle(o);
 }
}
export function action(c:ChapterContext,a:string){if(a==='winter-start'){c.modal='';c.talk('次は、雪の山',dialogue.intro);return true}if(a==='winter-notes'){c.modal='winter-notes';c.renderUI();return true}return false}
