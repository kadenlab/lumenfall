import type {ChapterContext,WorldObject} from '../types.ts';
import {completeChapter} from '../../systems/progression.ts';
import {awardGear,gear} from '../../systems/gear.ts';
import type {GearId} from '../../systems/gear.ts';
import {flags,won,linked,canEnter} from './state.ts';
import {dialogue} from './dialogue-config.ts';
import {placements,treasures} from './object-config.ts';
export function begin(c:ChapterContext){flags(c.state).arrived=true;c.modal='chapter4-title';c.save();c.renderUI()}
export function goal(c:ChapterContext){const f=flags(c.state);let id='';if(c.progress.completed)id=c.state.area===1?'rau':placements[c.state.area].find(p=>p.kind==='exit')?.id??'port';else if(won(c.state,'ignas'))id=c.state.area===1?'return':c.state.area===7?'memory':placements[c.state.area].find(p=>p.kind==='exit')?.id??'';
 else if(c.state.area===0)id='port';else if(c.state.area===1)id=!f.briefed?'rau':!f.west?'west':!f.east?'east':'ruins';else if(c.state.area===2)id=!won(c.state,'biter')?'biter':!won(c.state,'jelly')?'jelly':!f.west?'west':'port';else if(c.state.area===3)id=!won(c.state,'shell')?'shell':!won(c.state,'ray')?'ray':!f.east?'east':'port';else if(c.state.area===4)id=!won(c.state,'seawarden')?'seawarden':'corridor';else if(c.state.area===5)id=!f.cut?'cut':'altar';else if(c.state.area===6)id=!f.van?'van':'heart';else id='ignas';return c.objects.find(o=>o.id===id)}
export function ending(c:ChapterContext){if(c.progress.completed){c.talk('環海の記録',dialogue.record);return}if(c.state.area===1){returnHome(c);return}c.talk('中央祭壇の記録',dialogue.record,()=>{const f=flags(c.state);f.restored=true;f.network=true;c.progress.quests['ring-current']='return';c.build();c.save();void c.transition(1).then(()=>returnHome(c)).catch(()=>{})})}
function returnHome(c:ChapterContext){c.talk('無響の港',dialogue.home,()=>{const f=flags(c.state);f.restored=true;f.network=true;f.endingComplete=true;c.progress.quests['ring-current']='complete';completeChapter(c.state.campaign,[]);c.save();c.finish()})}
function rewardRoutes(c:ChapterContext){const f=flags(c.state);if(['mark-west','mark-east','mark-ring'].every(k=>f[k])&&c.progress.quests['lost-markers']!=='complete'){c.state.gold+=120;c.state.potions+=3;c.progress.quests['lost-markers']='complete';c.save();c.talk('潮読み セナ',['三つとも残っていたのね。これなら航路を引き直せる。ありがとう！','120Gと薬草3個を受け取った。']);return true}return false}
export function interact(c:ChapterContext,o:WorldObject){const s=c.state,f=flags(s);
 if(o.kind==='previous'){void c.switchChapter('chapter-3').catch(e=>c.notify(e.message));return}
 if(o.kind==='spring'){s.hp=c.maxHP();s.mp=c.maxMP();c.save();c.talk(o.name,['残った灯を囲んで休んだ。HP・MPが全回復した。何度でも利用できる。']);return}
 if(o.kind==='shop'){c.modal='shop';c.renderUI();return}
 if(o.kind==='npc'){
  if(o.id==='rau'){if(won(s,'ignas')&&!c.progress.completed){returnHome(c);return}if(!f.briefed){f.briefed=true;s.potions+=4;s.ethers+=4;c.progress.quests['ring-current']='islands'}c.talk(o.name,c.progress.completed?dialogue.home.slice(1,3):dialogue.rau)}
  if(o.id==='sena'){if(rewardRoutes(c))return;c.progress.quests['lost-markers']??='active';c.talk(o.name,dialogue.sena)}
  if(o.id==='ordo'){if(f.tablet&&c.progress.quests['stone-record']!=='complete'){c.progress.quests['stone-record']='complete';awardGear(s,'silent-cloth');c.talk(o.name,['師の石板だ。灯は輪の内側だけでなく、さらに遠くへ流れている……。','無響の衣を受け取り、装備した。被ダメージ −5。環海の妨害とMP吸収を半減する。'])}else{c.progress.quests['stone-record']??='active';c.talk(o.name,dialogue.ordo)}}
  if(o.id==='van'){c.talk(o.name,dialogue.van,()=>{f.van=true;c.progress.quests['ring-current']='heart';c.save()})}c.save();return;
 }
 if(o.kind==='chest'){if(c.progress.chests.includes(o.id)){c.notify('宝箱は空っぽだ');return}const t=treasures[o.id];if(!t)return;c.progress.chests.push(o.id);s.gold+=t.gold;s.potions+=t.potions;s.ethers+=t.ethers;if(t.gear)awardGear(s,t.gear as GearId);c.build();c.save();c.talk('宝箱',[`${t.gold}G・薬草${t.potions}個・星の雫${t.ethers}個を手に入れた。`,...(t.gear?[gear[t.gear as GearId].name+'を入手して装備した。']:[])]);return}
 if(o.kind==='marker'){f[o.id]=true;c.save();c.talk(o.name,['石に刻まれた矢印は、環の中央を指している。航路標を手帳に記録した。',`${['mark-west','mark-east','mark-ring'].filter(k=>f[k]).length}/3 箇所を確認。三つ確認したら港のセナへ。`]);return}
 if(o.kind==='tablet'){f.tablet=true;c.save();c.talk('石工の記録',['海水から古い石板を引き上げた。港のオルドへ届けよう。']);return}
 if(o.kind==='beacon'){const ready=o.id==='west'?won(s,'biter')&&won(s,'jelly'):won(s,'shell')&&won(s,'ray');if(!ready){c.talk('ミナ',['周りの二体を鎮めてから灯をつなごう。']);return}if(f[o.id]){c.talk(o.name,['光は海の底へ流れ続けている。']);return}f[o.id]=true;if(linked(s))c.progress.quests['ring-current']='ruins';c.build();c.save();c.burst(o.x,2,o.z,'#befff0',70);c.talk('ミナ',[...dialogue[o.id],...(linked(s)?dialogue.connected:[])]);return}
 if(o.kind==='lore'){f.cut=true;c.progress.quests['ring-current']='altar';c.save();c.talk('ミナ',dialogue.cut);return}
 if(o.kind==='exit'){const dest=placements[s.area].find(p=>p.id===o.id)!.destination!;if(!canEnter(s,dest)){c.talk('ミナ',[dest===2||dest===3?'まず港守ラウに航路を聞こう。':dest===4?'西と東、二つの環灯を復旧しよう。':dest===5?'無響の海守を鎮めれば、制御室へ進める。':dest===6?'回廊の切断面を確かめよう。':'祭壇の巡礼者に話を聞こう。']);return}void c.transition(dest).catch(()=>{});return}
 if(o.kind==='ending'){ending(c);return}
 if(o.kind==='enemy'||o.kind==='boss'){if(o.id==='ignas')c.talk('三つの灯',dialogue.before,()=>c.startBattle(o));else c.startBattle(o)}
}
export function action(c:ChapterContext,a:string){if(a==='ring-start'){c.modal='';c.talk('南西、無音の環海',dialogue.intro);return true}if(a==='ring-notes'){c.modal='ring-notes';c.renderUI();return true}if(a.startsWith('ring-buy:')){const id=a.slice(9) as GearId,cost=id==='ring-sword'?140:120;if(!['ring-sword','ring-cloak'].includes(id))return true;if(c.state.gold>=cost&&!c.state.gear?.owned.includes(id)){c.state.gold-=cost;awardGear(c.state,id);c.save();c.notify(gear[id].name+'を購入し装備した')}c.renderUI();return true}return false}
