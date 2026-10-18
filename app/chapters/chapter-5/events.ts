import type {ChapterContext,WorldObject} from '../types.ts';
import {flags,canEnter,operate,syncQuest} from './state.ts';
import {placements,treasures} from './object-config.ts';
import {dialogue} from './dialogue-config.ts';
export function begin(c:ChapterContext){if(!flags(c.state).introSeen){c.talk('灰に沈む灯',dialogue.intro,()=>{flags(c.state).introSeen=true;c.save()})}}
export function goal(c:ChapterContext){const f=flags(c.state),a=c.state.area;let id='';
 if(a===0)id=c.progress.defeatedEnemies.includes('ash-eater')?'city':'ash-eater';
 if(a===1)id=!f.elnaMet||f.officeRecord&&f.mineRecord&&!f.part1Complete?'elna':!f.officeRecord?'office':!f.mineRecord?'conduit':'touma';
 if(a===2)id=!f.baldoMet?'baldo':!f.officeRecord?'office-record':'lower';
 if(a===3)id=f.mineRecord?'lower':!f.passageRestored?['cooling','distribution','power'][Number(f.puzzleStep)||0]:'mine';
 if(a===4)id=f.mineRecord?'conduit':'mine-record';return c.objects.find(o=>o.id===id);
}
export function interact(c:ChapterContext,o:WorldObject){const s=c.state,f=flags(s),p=c.progress;
 if(o.kind==='previous'){void c.switchChapter('chapter-4').catch(e=>c.notify(e.message));return}
 if(o.kind==='spring'){s.hp=c.maxHP();s.mp=c.maxMP();c.save();c.talk(o.name,['細い配熱管のそばで休んだ。HP・MPが全回復した。何度でも休める。']);return}
 if(o.kind==='shop'){c.modal='shop';c.renderUI();return}
 if(o.kind==='exit'){const dest=placements[s.area].find(row=>row.id===o.id)?.destination;
  if(s.area===0&&dest===1&&!p.defeatedEnemies.includes('ash-eater')){c.talk('ミナ',['道の灰が動いてる。あの魔物を鎮めてから、街へ行こう。']);return}
  if(dest!==undefined&&canEnter(s,dest)){void c.transition(dest).catch(()=>{});return}
  c.talk('ミナ',[dest===4?'点検記録を読もう。冷却、分配、通電の順に操作すれば開くよ。':'まず下層区のエルナに話を聞こう。']);return;
 }
 if(o.kind==='enemy'){c.startBattle(o);return}
 if(o.kind==='device'){const result=operate(s,o.id);c.build();c.save();c.talk(o.name,[result==='reset'?'安全装置が作動した。操作は初めからやり直せる。冷却 → 分配 → 通電。':result==='open'?'青白い灯が通路を満たした。廃灰坑道への点検橋が開通している。':`装置が安定した。${f.puzzleStep}/3 起動。次の装置へ進もう。`]);return}
 if(o.kind==='chest'){const t=treasures[o.id];if(!t||p.chests.includes(o.id)){c.notify('宝箱は空っぽだ');return}p.chests.push(o.id);s.gold+=t.gold;s.potions+=t.potions;s.ethers+=t.ethers;c.build();c.save();c.talk('宝箱',[`${t.gold}G・薬草${t.potions}個・星の雫${t.ethers}個を手に入れた。`]);return}
 let lines:string[]=[];
 switch(o.id){
 case 'refugee':lines=['炉の明かりがあれば暮らせると思ったんだ。でも、下の区画は冷えるばかりでね……。'];break;
 case 'elna':
  if(!f.elnaMet){f.elnaMet=true;lines=dialogue.elna}
  else if(f.officeRecord&&f.mineRecord&&!f.part1Complete){lines=dialogue.report;c.talk(o.name,lines,()=>{f.part1Complete=true;syncQuest(s);c.save();c.renderUI()});return}
  else lines=f.part1Complete?['旧分灯塔へ向かう準備を続けよう。炉はまだ止めないで。今は街と地下を調べ直せるよ。']:f.officeRecord?['限界を超えた炉へ、海からの流れまで……。地下の古い設備に、別の受け皿がないか探してほしい。']:f.mineRecord?['分灯設備なら、トウマの灯にも説明がつく。炉政庁で稼働記録を確認しよう。切替には今の流量が必要だ。']:['炉政庁と地下、どちらからでも調べていいよ。休憩所も使って。'];break;
 case 'touma':lines=f.mineRecord?['昔の設備も、この灯と同じなの？ 小さくても、街の役に立てるかな。','リオ「その灯が教えてくれたんだ。別のやり方があるって」']:dialogue.touma;break;
 case 'resident':lines=[f.part1Complete?'エルナが配管を調べ直してる。まだ寒いけど、今夜の灯は守ってみせるよ。':'上の灯は金色だ。ここは湯が冷めるたびに、朝まで持つかを考える。'];break;
 case 'baldo':lines=f.baldoMet?(f.mineRecord?['分灯塔か……。各区画へ熱と水を送り続けられる証拠がいる。切替手順を整備士と確かめてくれ。']:['稼働記録は奥の机だ。限界は承知している。だが、炉を失った街の責任もある。']):dialogue.baldo;f.baldoMet=true;break;
 case 'office-record':if(!f.baldoMet){c.talk('記録係',['先に管理長バルドと話してください。']);return}f.officeRecord=true;lines=[...dialogue.office,...(f.mineRecord?['旧設備の分散図と照合できる。エルナのもとへ戻ろう。']:[])];break;
 case 'hint':lines=['保守手順：冷却で管を保護 → 分配で逃げ道を作る → 最後に通電。逆順では安全装置が全装置を停止する。','停止したら冷却から再開。身体への危険はなく、出口は常に開いている。'];break;
 case 'mine-record':f.mineRecord=f.towerClue=true;lines=[...dialogue.mine,...(!f.officeRecord?['今の流量も必要だ。炉政庁の記録を確かめよう。']:[])];break;
 case 'sealed':lines=['灰で塞がった深部の通路。ここを掘り進む必要はない。旧分灯塔の入口は地上にある。','今は送灯路から下層区へ戻れる。'];break;
 case 'letter':f.letterFound=true;lines=['煤けた手紙を拾った。「サラへ。古い設備の調査は終わった。帰りの搬送便を待っている。寒い夜は作業場へ。必ず戻る」','下層区のサラへ届けよう。'];break;
 case 'letter-owner':
  if(f.letterFound&&p.quests['soot-letter']!=='complete'){p.quests['soot-letter']='complete';s.gold+=100;s.potions+=2;lines=['あの人の字……帰るつもりでいるんだね。届けてくれてありがとう。','100Gと薬草2個を受け取った。']}
  else if(p.quests['soot-letter']==='complete')lines=['手紙は大事にしまったよ。作業場で、帰りを待つことにする。'];
  else{p.quests['soot-letter']='active';lines=['地下施設へ行った家族の便りが途絶えていてね。手紙を見つけたら届けてくれない？ 調査のついででいいんだ。']}break;
 }
 syncQuest(s);c.save();if(lines.length)c.talk(o.name,lines);
}
export function action(c:ChapterContext,a:string){if(a==='ash-notes'){c.modal='ash-notes';c.renderUI();return true}return false}
