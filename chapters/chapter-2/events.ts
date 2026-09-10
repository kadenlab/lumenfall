import type {ChapterContext,WorldObject} from '../types.ts';
import {flags,won,allClues,bridgeOpen,naveOpen,choirReady,order} from './state.ts';
import {dialogue} from './dialogue-config.ts';
import {placements,treasures,guardians} from './object-config.ts';
export function goal(c:ChapterContext){const f=flags(c.state);let id='';if(c.progress.completed)return undefined;
 if(c.state.area===0){id=!f.briefed?'keeper':!f['clue-bell']?'bell':!f['clue-boat']?'boat':!f['clue-star']?'star':!f.permit?'keeper':'coast'}
 if(c.state.area===1){const n=Number(f.beacons??0);id=n<3?order[n]+'-beacon':'chapel';if(guardians[id]&&!won(c.state,guardians[id]))id=guardians[id]}
 if(c.state.area===2){id=!f['nave-west']?'nave-west':!f['nave-east']?'nave-east':!won(c.state,'bellwarden')?'bellwarden':'choir';if(guardians[id]&&!won(c.state,guardians[id]))id=guardians[id]}
 if(c.state.area===3)id=!f.rested?'rest-light':!f['vigil-west']?'vigil-west':!f['vigil-east']?'vigil-east':!f['vigil-heart']?'vigil-heart':'nereis';
 return c.objects.find(o=>o.id===id)}
export function begin(c:ChapterContext){c.talk('潮風の記憶',dialogue.intro,()=>{flags(c.state).arrived=true;c.save()})}
export function interact(c:ChapterContext,o:WorldObject){const f=flags(c.state),s=c.state;
 if(o.kind==='previous'){c.modal='home-confirm';c.renderUI();return}
 if(o.kind==='shop'||o.kind==='inn'){c.modal=o.kind;c.renderUI();return}
 if(o.kind==='npc'){
  if(o.id==='keeper'){if(c.progress.completed)c.talk('港守のイサ',dialogue.ending);else if(!f.briefed){f.briefed=true;c.talk('港守のイサ',dialogue.keeper)}else if(allClues(s)&&!f.permit){f.permit=true;s.potions+=3;s.ethers+=3;c.progress.quests['missing-lights']='crossing';c.talk('港守のイサ',dialogue.permit)}else c.talk('港守のイサ',['鐘番、船大工、星図師の話を聞いてきてほしい。三人の証言が揃ったら、航路の油を渡そう。'])}
  else if(o.id==='survivor'){f.rescued=true;c.progress.quests['lost-brother']='return';s.ethers+=1;c.talk('トワの弟',dialogue.survivor,()=>c.build())}
  else if(o.id==='bell'&&f.rescued&&!f.rescueReward){f.rescueReward=true;s.gold+=60;s.potions+=2;c.progress.quests['lost-brother']='complete';c.talk('鐘番のトワ',['弟が戻った！ 鈴の音が聞こえた時、ずっと消せなかった灯が温かくなったの。','ありがとう。60Gと薬草2個を、次の旅に持っていって。'])}
  else if(o.id==='boat'&&c.progress.chests.includes('tools')&&!f.toolsReward){f.toolsReward=true;s.gold+=50;s.ethers+=2;c.progress.quests['lost-tools']='complete';c.talk('船大工のロウ',['工具箱を拾ってくれたのか！ これで帰ってきた人たちの船を直せる。','50Gと星の雫2個を受け取った。'])}
  else{f['clue-'+o.id]=true;if(o.id==='bell'&&!f.rescued)c.progress.quests['lost-brother']='active';if(o.id==='boat'&&!f.toolsReward)c.progress.quests['lost-tools']='active';c.talk(o.name,dialogue[o.id])}c.save();return;
 }
 if(o.kind==='lore'){c.talk(o.name,['「灯は分けよ。西の祈り、東の祈り。二つが揃う時、鐘へ至る段が見える」','ミナ「両側の回廊へ行こう。番獣を鎮めてから、燭台に火を移すんだね」']);return}
 if(o.kind==='chest'){if(c.progress.chests.includes(o.id)){c.notify('宝箱は空っぽだ');return}const t=treasures[o.id];c.progress.chests.push(o.id);s.gold+=t.gold;s.potions+=t.potions;s.ethers+=t.ethers;o.name='空の宝箱';c.save();c.talk('宝箱',[`${t.gold}G・薬草${t.potions}個・星の雫${t.ethers}個を手に入れた！`,...(o.id==='tools'?['船大工の工具箱も見つけた。港のロウに届けよう。']:[])]);return}
 if(o.kind==='beacon'||o.kind==='lamp'){
  const guard=guardians[o.id];if(guard&&!won(s,guard)){c.talk(o.name,['灯のまわりを魔物が覆っている。まず近くの魔物を鎮めよう。']);return}
  if(o.kind==='beacon'){const i=order.findIndex(id=>o.id===id+'-beacon'),n=Number(f.beacons??0);if(i<n){c.talk(o.name,['航路灯は、静かに海を照らしている。']);return}c.modal='beacon:'+o.id;c.renderUI();return}
  if(f[o.id]){c.talk(o.name,['火は絶えずに燃えている。']);return}f[o.id]=true;c.build();c.save();c.burst(o.x,c.height(o.x,o.z)+1.8,o.z,'#ffdfa4',70);c.talk('ミナ',[s.area===2?(naveOpen(s)?'左右の灯がつながった。鐘楼へ続く階段が見える！':'一つ目の祈りが戻った。もう一方の燭台にも火を分けよう。'):(choirReady(s)?'三つの帰り灯が揃った。歌の主を、光の輪へ。':'帰り灯を一つ点けた。残りの燭台にも火を分けよう。')]);return;
 }
 if(o.kind==='spring'){s.hp=c.maxHP();s.mp=c.maxMP();f.rested=true;c.save();c.talk(o.name,['港から持ってきた灯が、ふたりを温める。HP・MPが全回復した。','ここでは何度でも休める。奥へ向かう前に準備を整えよう。']);return}
 if(o.kind==='exit'){const dest=placements[s.area].find(p=>p.id===o.id)!.destination!;if(s.area===0&&dest===1&&!f.permit){c.talk('ミナ',['先に港で聞き込みをして、イサから航路の油を受け取ろう。']);return}if(s.area===1&&dest===2&&!bridgeOpen(s)){c.talk('ミナ',['道が海に沈んでいる。〈鐘 → 舟 → 星〉の順に灯そう。']);return}if(s.area===2&&dest===3&&!won(s,'bellwarden')){c.talk('ミナ',['鐘楼の衛士を鎮めれば、深部への扉が開くはず。']);return}void c.transition(dest).catch(()=>{});return}
 if(o.kind==='enemy'||o.kind==='boss'){if(o.id==='bellwarden'&&!naveOpen(s)){c.notify('左右の祈り灯を点けよう');return}if(o.id==='nereis'&&!choirReady(s)){c.talk('ミナ',['先に三つの帰り灯を点けよう。光がないと、歌の主に届かない。']);return}if(o.id==='nereis'&&!f.bossBriefed){f.bossBriefed=true;c.save();c.talk('ミナ',dialogue.beforeBoss,()=>c.startBattle(o))}else c.startBattle(o);return}
}
export function action(c:ChapterContext,a:string){if(a==='return-chapter-1'){c.modal='';void c.switchChapter('chapter-1').catch(e=>c.notify(e.message));return true}if(a==='ignite-beacon'&&c.modal.startsWith('beacon:')){const id=c.modal.slice(7),f=flags(c.state),i=order.findIndex(k=>id===k+'-beacon'),n=Number(f.beacons??0);if(i!==n){c.notify('順番が違う。〈鐘 → 舟 → 星〉。点けた灯は消えないよ。');return true}f.beacons=n+1;c.modal='';c.build();c.save();const o=c.objects.find(o=>o.id===id)!;c.burst(o.x,2,o.z,'#c3f6ff',90);c.talk('ミナ',n===2?dialogue.bridge:[o.name+'が点いた。次は'+(n===0?'舟':'星')+'の灯へ。']);return true}return false}
