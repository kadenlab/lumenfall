import type {GameState} from '../systems/state.ts';
import {incoming} from './state.ts';
export const trialNames=['灯守','残光','暗霧','無癒','灯喰らい'];
export const descriptions=[
 '灯HPを守り、3つのWaveを突破する。灯を守ると、そのターンの灯へのダメージを90%軽減。上の敵名で攻撃対象を選べる。',
 '15ターンを生き抜く。5・9・12ターン開始時に増援。敵を減らせば被害を抑えられる。最後まで倒しきる必要はない。',
 '霧の番獣を倒す。灯を掲げると1ターン消費し、続く3回の行動選択中はHP・弱点・予告が見える。',
 '回復なしで3連戦。HP・MP・消費した品はWaveをまたいで引き継ぐ。回復アイテム・回復魔法・リジェネは無効。',
 '灯ゲージを守り灯喰らいを倒す。欠片を拾うと灯が25回復。灯を守ると吸光を90%軽減。HP半分で第二形態。',
];
export type Foe={name:string;hp:number;max:number;attack:number;target:'hero'|'lamp'|'adaptive'};
export type TrialRun={id:number;turn:number;wave:number;lamp:number;reveal:number;phase:number;shards:number;foes:Foe[];message:string;result:'active'|'win'|'lose';target:number};
const foe=(name:string,hp:number,attack:number,target:Foe['target']='hero'):Foe=>({name,hp,max:hp,attack,target});
function wave(id:number,n:number):Foe[]{
 if(id===1)return n===1?[foe('影の剣士',100,17),foe('灯狙いの蛾',80,18,'lamp')]:n===2?[foe('灯狙いの蛾',100,22,'lamp'),foe('彷徨う影',100,18,'adaptive')]:[foe('灯狙いの蛾',110,24,'lamp'),foe('影の剣士',100,20),foe('彷徨う影',100,20,'adaptive')];
 if(id===2)return [foe('残響の兵',150,16),foe('残響の弓手',110,12)];
 if(id===3)return [foe('暗霧の番獣',600,24)];
 if(id===4)return [foe(['傷なき影','乾いた守衛','無癒の番獣'][n-1],[160,210,260][n-1],[17,21,25][n-1])];
 return [foe('灯喰らい',960,24)];
}
export function createRun(id:number):TrialRun{if(id<1||id>5)throw Error('試練がありません');return {id,turn:0,wave:1,lamp:100,reveal:0,phase:1,shards:3,foes:wave(id,1),message:'灯守たちの試練が始まる。',result:'active',target:0}}
export function hidden(r:TrialRun){return r.id===3&&r.reveal<=0}
export function allowed(r:TrialRun,cmd:string){if(r.result!=='active')return false;if(r.id===4&&['heal','potion','ether'].includes(cmd))return false;return ['attack','fire','heal','potion','ether','guard'].includes(cmd)||cmd==='raise'&&r.id===3||cmd==='protect'&&(r.id===1||r.id===5)||cmd==='shard'&&r.id===5&&r.shards>0}
export function totalHP(r:TrialRun){return r.foes.reduce((n,f)=>n+f.hp,0)}
export function forecast(r:TrialRun){if(hidden(r))return '濃霧に包まれ、敵の情報は見えない。';if(r.id===5)return (r.turn+1)%3===0?'予告：大吸光 — 灯を守る！':'予告：爪撃と吸光';if(r.id===3)return (r.turn+1)%3===0?'予告：霧裂き（大ダメージ） · 弱点：星火':'予告：爪撃 · 弱点：星火';return r.foes.filter(f=>f.hp>0).map(f=>f.name+' → '+(f.target==='lamp'?'灯':f.target==='adaptive'?(r.lamp<55?'灯':'主人公'):'主人公')).join(' ／ ')}
/** One explicit command resolves one turn. No real-time damage or timers in the rules. */
export function resolveTurn(r:TrialRun,s:GameState,cmd:string,damage:number,rng=Math.random){
 if(!allowed(r,cmd))return false;
 r.turn++;r.reveal=Math.max(0,r.reveal-1);r.message='';
 if(cmd==='raise'){r.reveal=3;r.message='灯を掲げた。3ターンの間、霧の奥が見える。'}
 if(cmd==='shard'){r.shards--;r.lamp=Math.min(100,r.lamp+25);r.message='欠片を拾い、灯が25回復した。'}
 if(cmd==='protect')r.message='灯を守る構え。';
 if(damage>0){const f=r.foes[r.target]?.hp>0?r.foes[r.target]:r.foes.find(f=>f.hp>0);if(f){const n=r.id===3&&cmd==='fire'?Math.round(damage*1.2):damage;f.hp=Math.max(0,f.hp-n);r.message+=f.name+'に'+n+'ダメージ。'}}
 if(totalHP(r)===0&&r.id!==2){if((r.id===1||r.id===4)&&r.wave<3){r.wave++;r.foes=wave(r.id,r.wave);r.target=0;r.message+=' Wave '+r.wave+'。HPを引き継いで次の敵が現れた。';return true}r.result='win';return true}
 if(r.id===5&&r.foes[0].hp<=480&&r.phase===1){r.phase=2;r.shards+=2;r.message+=' 灯喰らいが第二形態へ。光の欠片が2つ落ちた！'}
 let hpDamage=0,lampDamage=0;
 for(const f of r.foes){if(f.hp<=0)continue;const lamp=r.id===1&&(f.target==='lamp'||f.target==='adaptive'&&r.lamp<55);if(lamp){lampDamage+=Math.ceil(f.attack*(cmd==='protect'?.1:1));continue}
 let n=f.attack;if(r.id===3&&r.turn%3===0)n=68;if(r.id===5)n=r.phase===2?24:18;hpDamage+=incoming(s,n,cmd==='guard'||cmd==='protect',rng);}
 if(r.id===5)lampDamage=Math.ceil((r.turn%3===0?(r.phase===2?40:32):(r.phase===2?6:4))*(cmd==='protect'?.1:1));
 s.hp=Math.max(0,s.hp-hpDamage);r.lamp=Math.max(0,r.lamp-lampDamage);
 if(hpDamage)r.message+=' HP −'+hpDamage+'。';else r.message+=' 傷を受けずにしのいだ。';if(lampDamage)r.message+=' 灯 −'+lampDamage+'。';
 if(s.hp<=0||r.lamp<=0){r.result='lose';r.message+=r.lamp<=0?' 灯が消えた。':'力尽きた。';return true}
 if(r.id===2){if(r.turn>=15){r.result='win';return true}if([4,8,11].includes(r.turn)){const n=r.turn===11?2:1;for(let i=0;i<n;i++)r.foes.push(foe('増援の影',120,r.turn===11?20:16));r.message+=' 増援が'+n+'体現れた！'}}
 return true;
}
