import {drainMP} from '../../systems/gear-effects.ts';
import type {ChapterContext} from '../types.ts';
import {resists} from '../../systems/gear.ts';
export type Lamp='attack'|'defense'|'cycle';
export type RingFight={stopped: Lamp|null;until:number;cooldown:number;last: Lamp|null;phase:number};
export const createFight=():RingFight=>({stopped:null,until:0,cooldown:0,last:null,phase:1});
export const names:Record<Lamp,string>={attack:'攻灯',defense:'防灯',cycle:'循環灯'};
export const active=(f:RingFight,l:Lamp,turn:number)=>f.stopped!==l||turn>f.until;
export function canSwitch(f:RingFight,l:Lamp,turn:number){return turn>f.cooldown&&f.last!==l}
export function switchLamp(f:RingFight,l:Lamp,turn:number){if(!canSwitch(f,l,turn))return false;f.stopped=l;f.last=l;f.until=turn+2;f.cooldown=turn+(f.phase===2?2:1);return true}
export function hit(f:RingFight,id:string,turn:number,cmd:string,base:number,resistant=false){if(!base)return 0;if(id==='ignas')return Math.round(base*(active(f,'defense',turn)?.78:1.4));if(id.startsWith('shell'))return Math.round(base*(cmd==='attack'?.68:1));if(id.startsWith('jelly')&&turn%3===0&&cmd==='attack')return Math.round(base*(resistant?.9:.8));return base}
export function retaliation(f:RingFight,id:string,turn:number){if(id==='ignas')return Math.round((turn%5===0?80:f.phase===2?26:20)*(active(f,'attack',turn)?1.2:1));if(id==='seawarden')return turn%4===0?95:turn%4===3?12:30;if(id.startsWith('biter'))return turn%2===0?38:25;if(id.startsWith('shell'))return turn%3===1?12:32;if(id.startsWith('jelly'))return 27;return 31}
export const recovery=(f:RingFight,turn:number)=>active(f,'cycle',turn)?turn%5===0?45:5:0;
export function forecast(id:string,turn:number){if(id==='ignas')return turn%5===4?'環海沈降まで2行動。HPと循環灯を確認':turn%5===0?'環海沈降！ 防御で軽減／循環灯が生きていると敵HP +45':'三灯が稼働。防灯停止で攻め、攻灯停止で立て直す';if(id==='seawarden')return turn%4===0?'白い灯 → 無響圧。今、防御！':turn%4===3?'音が吸われる。灯が白くなる：次の行動で大技':'海守の体当たり。白い灯が危険の合図';if(id.startsWith('biter'))return turn%2===0?'二連噛み：防御で軽減':'潮の爪';if(id.startsWith('shell'))return '石殻の守り：星火が有効';if(id.startsWith('jelly'))return turn%3===0?'無響の幕：剣 −20%／星火は通常':'触手の光が揺れる';return '吸灯：MP −4。星火で吸収を阻止'}
let fight=createFight();
export function start(){fight=createFight()}
export function commands(c:ChapterContext){if(c.battle?.id!=='ignas')return [];const turn=c.battle.turn+1;return (['attack','defense','cycle'] as Lamp[]).map(l=>({id:'route:'+l,label:'灯路を切り替える：'+names[l]+'停止',disabled:!canSwitch(fight,l,turn)}))}
export function onCommand(c:ChapterContext,id:string,turn:number,cmd:string){if(id!=='ignas'||!cmd.startsWith('route:'))return;const l=cmd.slice(6) as Lamp;if(names[l]&&switchLamp(fight,l,turn))c.burst(0,2,-8,'#b7fff0',60)}
export function damage(c:ChapterContext,id:string,turn:number,cmd:string,base:number){return hit(fight,id,turn,cmd,base,resists(c.state))}
export function enemyAttack(c:ChapterContext,id:string,turn:number,cmd:string,_base:number){fight.phase=c.battle?.phase??1;if(id.startsWith('ray')&&cmd!=='fire')drainMP(c.state,resists(c.state)?2:4);if(id==='ignas'&&c.battle){c.battle.hp=Math.min(c.battle.max,c.battle.hp+recovery(fight,turn));for(const l of ['attack','defense','cycle'] as Lamp[]){const m=c.world.userData.ringLamps?.[l];if(m)m.emissiveIntensity=active(fight,l,turn+1)?2.1:.08}}if(id==='seawarden'){const m=c.world.userData.signal;if(m){m.color.set((turn+1)%4===0?'#ffffff':'#76d5d3');m.emissive.set((turn+1)%4===0?'#ffffff':'#76d5d3');m.emissiveIntensity=(turn+1)%4===0?3.5:1.2}}return retaliation(fight,id,turn)}
export function status(c:ChapterContext,id:string,turn:number){const lamps=id==='ignas'?(['attack','defense','cycle'] as Lamp[]).map(l=>names[l]+(active(fight,l,turn+1)?'●':'停止')).join(' ／ ')+`<br>切替まで ${Math.max(0,fight.cooldown-turn)} 行動（同じ灯の連続停止不可）<br>`:'';return lamps+forecast(id,turn+1)}
export function enemyLabel(_c:ChapterContext,id:string,turn:number){return id==='ignas'?turn%5===0?'環海沈降！':'円環の光刃！':id==='seawarden'?turn%4===0?'無響圧！':'石潮の衝撃！':id.startsWith('ray')?'吸灯の翼！':id.startsWith('biter')&&turn%2===0?'二連噛み！':'環海の一撃！'}
export function onPhase(c:ChapterContext){fight.phase=2;if(c.battle?.id==='ignas'){const sp=c.objects.find(o=>o.id==='ignas')?.mesh;if(sp)c.reskin(sp as any,'ignas-open');const m=c.world.userData.core;if(m)m.emissiveIntensity=3.5;c.burst(0,3,-10,'#eaffce',100)}}
export function audioScale(c:ChapterContext){return c.battle?.id==='seawarden'&&c.battle.turn%4>=2?.22:c.state.area===0?.5:1}

export function hideInfo(c:ChapterContext){return !!c.battle?.id.startsWith('jelly')&&(c.battle.turn+1)%3===0&&!resists(c.state)}
