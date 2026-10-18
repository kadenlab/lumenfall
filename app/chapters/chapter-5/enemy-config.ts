import type {EnemyConfig,ChapterContext} from '../types.ts';
import {drainMP} from '../../systems/gear-effects.ts';
import {resists} from '../../systems/gear.ts';
// C4 normals HP 255–340 / attack 25–32; C5 assumes level 14+ and ordinary C4 gear.
export const enemies:Record<string,EnemyConfig>={
 'ash-eater':{hp:300,attack:28,xp:185,gold:55,intro:'灰喰いが灰の下から現れた。基本攻撃を中心に戦う。星火で早く鎮めよう。'},
 'machine-wolf':{hp:380,attack:33,xp:210,gold:70,intro:'焼け歯の機狼が歯車を鳴らす。3行動目の突進は防御！'},
 'lamp-moth':{hp:320,attack:29,xp:195,gold:60,intro:'灯吸い蛾はMPを3吸う。星火でそのターンの吸収を止められる。'}
};
export function damage(_c:ChapterContext,_id:string,_turn:number,_cmd:string,base:number){return base}
export function enemyAttack(c:ChapterContext,id:string,turn:number,cmd:string,base:number){if(id==='lamp-moth'&&cmd!=='fire')drainMP(c.state,resists(c.state)?2:3);return id==='machine-wolf'?(turn%3===0?58:turn%3===2?16:base):base}
export function status(_c:ChapterContext,id:string,turn:number){return id==='machine-wolf'?(turn%3===2?'焼けた歯が白く光る。次の突進は防御！':turn%3===1?'歯車を巻く。次の行動は準備、その後に突進。':'機狼の爪。3行動ごとの突進に備える。'):id==='lamp-moth'?'吸灯：MP −3。星火で今回の吸収を阻止。星の雫で補充できる。':'灰の爪。HPが減ったら薬草や灯の癒し。'}
export function enemyLabel(_c:ChapterContext,id:string,turn:number){return id==='machine-wolf'?(turn%3===0?'焼け歯の突進！':turn%3===2?'歯車を巻きながら噛みつく！':'機狼の爪！'):id==='lamp-moth'?'吸灯の羽ばたき！':'灰の爪！'}
