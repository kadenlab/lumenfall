import {paintFoe} from './presentation.ts';
import type {Chapter} from '../chapters/types.ts';
import {migrateTrials,chapter2Cleared} from './state.ts';
import {trialNames,descriptions} from './rules.ts';
const pack:Chapter={id:'trials',title:'灯の試練',unlockNext:[],start:{area:0,x:0,z:7},returnTo:{area:0,x:0,z:7},respawn:{area:0,x:0,z:7},
 maps:[{id:0,name:'灯守の環',eyebrow:'THE TRIALS OF LIGHT',description:'闇の奥、受け継がれる五つの灯',night:true,spawn:{x:0,z:7},load:()=>import('./map.ts')}],
 enemies:Object.fromEntries(trialNames.map((name,i)=>['trial-'+(i+1),{hp:i===4?960:600,attack:20,xp:0,gold:0,boss:i===4,eyebrow:'灯の試練 · '+(i+1),intro:name+' — '+descriptions[i]}])),
 initialize(s){if(!chapter2Cleared(s))throw Error('Chapter 2クリア後に解放されます');migrateTrials(s)},normalize(s){s.area=0;if(Math.hypot(s.x,s.z)>11){s.x=0;s.z=7}},height:()=>0,walkable:(_s,x,z)=>Math.hypot(x,z)<11.5,vegetation:()=>false,hasCompanion:()=>true,
 entry:()=>({x:0,z:7}),goal:c=>c.objects.find(o=>o.id==='altar'),begin(c){c.talk('灯守の残響',['ここは灯守の環。力だけでは守れぬ灯がある。','五つの試練は、すべてコマンドを選ぶターン制。敗れても本編の記録は失われない。祭壇で準備を整えよう。'])},enter(){},
 interact(c,o){if(o.id==='return'){void c.switchChapter('chapter-2');return}c.modal='trials';c.renderUI()},action:()=>false,
 hud:c=>`<div class="top"><div class="region"><small>THE TRIALS OF LIGHT</small><h2>灯守の環</h2><p>闇に沈まぬ灯を、その手に。</p></div><div class="tools"><button class="iconbtn" data-action="sound" aria-label="音の切り替え">♪</button><button class="iconbtn" data-action="menu" aria-label="冒険メニュー">☰</button></div></div><div class="quest"><button class="guide" data-action="trials">灯の試練を選ぶ</button></div>`,modalUI:()=>'',endingUI:()=>'',objectVisibleInGuide:()=>true,
 onBossVictory(){},onEnding(){},onDefeat(){},onRest(){},music:{field:[130.81,196,246.94,293.66],night:[130.81,196,246.94,293.66,220,164.81],battle:[130.81,130.81,196,233.08,220,164.81]},effects:{phaseFog:'#23152e',phaseDensity:.036,phaseSun:'#bda9ff'},
 paintSprite(kind,r){if(paintFoe(kind,r))return true;if(!kind.startsWith('trial-'))return false;const boss=kind==='trial-5',color=boss?'#887cbb':'#668eae';r(17,10,14,10,'#bceafa');r(12,22,24,25,color);r(6,27,8,22,'#304558');r(34,25,8,25,'#304558');r(15,45,7,15,'#263545');r(27,45,7,15,'#263545');r(20,17,3,3,'#70fff1');r(27,17,3,3,'#70fff1');r(20,29,10,9,'#a8fff4');if(boss){r(5,5,5,28,'#bcb9d4');r(38,5,5,28,'#bcb9d4');r(9,3,30,4,'#8090ac');r(21,31,8,6,'#132336')}return true},
};export default pack;
