import type {EnemyConfig,ChapterContext} from '../types.ts';
import {createFight,deal,retaliation,forecast} from './combat.ts';
const common={scriptedBattle:true};
export const enemies:Record<string,EnemyConfig>={
 frost:{...common,hp:185,attack:22,xp:90,gold:35,intro:'霜喰いが雪を蹴った。二行動目は二連撃。'},
 soldier:{...common,hp:230,attack:23,xp:105,gold:40,intro:'凍灯兵は氷盾を構える。星火で崩そう。'},
 shade:{...common,hp:235,attack:25,xp:110,gold:42,intro:'白霧の亡影が輪郭を失う。濃霧には星火。'},
 hunter:{...common,hp:265,attack:29,xp:125,gold:48,intro:'灯狩りが魔力を吸おうとしている。星火でけん制！'},
 warden:{...common,hp:560,attack:32,xp:180,gold:85,boss:true,eyebrow:'THE FROZEN SENTINEL',intro:'凍れる番人が盾を構える。星火で砕き、隙を攻めよう。',phaseText:'兜の青炎が揺れる。盾の破片から、古い紋が見えた。'},
 aurel:{...common,keepAfterVictory:true,hp:960,attack:27,xp:300,gold:180,boss:true,eyebrow:'AUREL · WARDEN OF THE THIRD LIGHT',intro:'黒い氷が割れ、氷葬の灯守が立つ。凍灯には星火、予告には防御。',phaseText:'「……灯を……消すな……」黒い氷が砕け、胸の青い灯が露出した。黒い霧が溢れる——第二形態。'}
};
let fight=createFight();
export function start(){fight=createFight()}
export function damage(_c:ChapterContext,id:string,turn:number,cmd:string,base:number){return deal(fight,id,turn,cmd,base)}
export function enemyAttack(c:ChapterContext,id:string,turn:number,cmd:string,_base:number){
 const damage=retaliation(fight,id,turn,cmd,c.battle?.phase??1);
 if(id==='hunter'&&cmd!=='fire')c.state.mp=Math.max(0,c.state.mp-3);
 if(id==='aurel'){
  for(const m of c.world.userData.hearths??[])m.emissiveIntensity=fight.freeze>0?.35:2.4;
  if(fight.thaw)c.burst(c.state.x,2,c.state.z,'#ffe3ab',65);
 }
 return damage;
}
export function status(c:ChapterContext,id:string,turn:number){return (id==='aurel'?`大灯：${fight.freeze>0?'凍結まであと1行動！ 星火で解除':'灯が続いている'} ／ `:'')+forecast(id,turn+1,c.battle?.phase??1,fight.phaseAt)}
export function enemyLabel(_c:ChapterContext,id:string,turn:number){if(id==='aurel')return fight.frozenStrike?'大灯が凍結！ 強化された氷刃！':turn%8===4?'氷葬！':turn%8===0&&fight.phase===2&&turn-fight.phaseAt>=2?'雪崩！':turn%8===5?'白夜の霧！':'氷刃！';if(id==='frost'&&turn%2===0)return '双霜爪（二連撃）！';if(id==='hunter')return '吸光の爪！';return '氷と霧の一撃！'}
export function onPhase(c:ChapterContext){fight.phase=2;fight.phaseAt=c.battle?.turn??0;if(c.battle?.id==='aurel'){const body=c.objects.find(o=>o.id==='aurel')?.mesh;if(body)c.reskin(body as any,'aurel-awake')}const fog=c.world.userData.blackFog;if(fog)fog.opacity=.58;const snow=c.world.userData.snowStrength;if(snow)snow.value=1.8;for(const m of c.world.userData.hearths??[])m.emissiveIntensity=3.1;c.burst(0,0,-8,'#ddfaff',150)}
