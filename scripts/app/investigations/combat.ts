import type {ChapterContext} from '../chapters/types.ts';
import {drainMP} from '../systems/gear-effects.ts';
export type InvestigationFight={wind:number;absorbed:number;cold:number;limit:number;stopped:string};
export const createFight=():InvestigationFight=>({wind:0,absorbed:0,cold:0,limit:3,stopped:'none'});
let fight=createFight();
export function start(){fight=createFight()}
export function onCommand(_c:ChapterContext,id:string,turn:number,cmd:string){if(id==='afterwind'&&turn%4===1)fight.wind=2;if(id==='ring-remnant'&&['route:attack','route:defense','route:cycle'].includes(cmd))fight.stopped=cmd.slice(6)}
export function damage(_c:ChapterContext,id:string,_turn:number,cmd:string,base:number,rng=Math.random){if(base<=0)return base;if(id==='afterwind'&&fight.wind){if(cmd==='attack'&&rng()<.18)return 0;fight.wind=Math.max(0,fight.wind-(cmd==='fire'?2:1))}return id==='ring-remnant'&&fight.stopped!=='defense'?Math.round(base*.8):base}
export function enemyAttack(c:ChapterContext,id:string,turn:number,_cmd:string,base:number){
 if(id==='afterwind')return turn%4===0?base*2+8:turn%2===0?base+8:base;
 if(id==='echo-jelly'){if(turn%3===1){fight.absorbed=drainMP(c.state,6);return 16}const n=base+fight.absorbed*2;fight.absorbed=0;return n}
 if(id==='reverse-frost'){fight.cold++;const rage=1-(c.battle?.hp??1)/(c.battle?.max??1),limit=fight.limit;fight.limit=rage>=.5?2:3;if(fight.cold>=limit){fight.cold=0;return Math.round(76+rage*12)}return Math.round(base*(1+rage*.3))}
 if(id==='ring-remnant'){if(fight.stopped!=='cycle'&&c.battle)c.battle.hp=Math.min(c.battle.max,c.battle.hp+16);return Math.round(base*(turn%4===0?2.2:1)*(fight.stopped==='attack'?.75:1.15))}
 return base;
}
export function status(c:ChapterContext,id:string,turn:number){const next=turn+1;
 if(id==='afterwind')return `風まとい ${fight.wind}（星火で散らせる） · ${next%4===0?'⚠ 残風裂き：次は2連撃。今、防御！':'残風裂きまで '+(4-next%4)+' 行動。剣には回避あり'}`;
 if(id==='echo-jelly')return next%3===1?'残響吸い予告：MP −6、次攻撃強化。HPは常に確認可能':fight.absorbed?`⚠ 吸収した魔力で次の攻撃 +${fight.absorbed*2}。残響で弱点の輪郭が揺れる`:'残響の触手。次の吸収に備えよう';
 if(id==='reverse-frost'){const limit=fight.limit;return `冷気 ${fight.cold}/${limit} · ${fight.cold+1>=limit?'⚠ 白夜崩し：今、防御！':'弱るほど攻撃上昇。冷気が満ちる前に攻めよう'}`}
 return `停止中：${({attack:'攻灯',defense:'防灯',cycle:'循環灯'} as Record<string,string>)[fight.stopped]??'なし'}。攻灯=敵攻撃低下／防灯=敵防御解除／循環灯=敵回復停止。${next%4===0?'⚠ 残環の圧光：今、防御！':'切替は1行動消費、停止は持続。'}`;
}
export function commands(c:ChapterContext){return c.battle?.id==='ring-remnant'?['attack','defense','cycle'].map((id,i)=>({id:'route:'+id,label:'灯路を切り替える：'+['攻灯','防灯','循環灯'][i]+'停止',disabled:fight.stopped===id})):[]}
export function enemyLabel(_c:ChapterContext,id:string,turn:number){if(id==='afterwind')return turn%4===0?'残風裂き・二連撃！':'灰羽の連爪！';if(id==='echo-jelly')return turn%3===1?'残響吸い！':'残響の触手！';if(id==='reverse-frost')return fight.cold===0?'白夜崩し！':'逆流の冷爪！';return turn%4===0?'残環の圧光！':'守機の光刃！'}
