import type {EnemyConfig,ChapterContext} from '../types.ts';
const shell:EnemyConfig={hp:145,attack:18,xp:65,gold:28,intro:'潮殻ヤドリは殻を閉じた。剣より星火が有効だ。'};
const jelly:EnemyConfig={hp:160,attack:20,xp:70,gold:30,intro:'霧縫いクラゲが漂う。三行動ごとに霧が濃くなる。'};
const moth:EnemyConfig={hp:170,attack:23,xp:75,gold:32,intro:'灯喰い蛾が火を狙う。星火でけん制すれば反撃が弱まる。'};
export const enemies:Record<string,EnemyConfig>={shell,jelly,moth,'jelly-nave':{...jelly,hp:185,xp:80},'moth-nave':{...moth,hp:200,xp:85},
 bellwarden:{hp:360,attack:26,phaseAttack:32,chargeAttack:64,boss:true,xp:145,gold:65,fireBonus:8,eyebrow:'WARDEN OF THE SUNKEN BELL',intro:'沈鐘の衛士が鎖を引く。鐘が響いた次の一撃は、防御で受けよう。',chargeText:'ボルンが沈んだ鐘を鳴らす。次の一撃に備えよう！',chargeName:'沈鐘の余波！',phaseText:'鎧の隙間に、航路灯の光が届いた。衛士の最後の務めが始まる。'},
 nereis:{hp:680,attack:29,phaseAttack:36,chargeAttack:78,boss:true,xp:210,gold:120,fireBonus:10,eyebrow:'NEREIS · THE SONG THAT UNLIGHTS',intro:'帰り灯が震える。ネレイスは三行動ごとに灯を消す。星火で再点灯、または防御！',chargeText:'歌が途切れた。次に来る無灯の波に備えよう！',chargeName:'無灯の聖歌！',phaseText:'天窓の星が消えた。帰り灯だけが、ふたりの名前をつなぎとめる。'},
};
export function damage(_c:ChapterContext,id:string,turn:number,cmd:string,base:number){if(!base)return 0;if(id==='shell')return Math.round(base*(cmd==='attack'?.55:1.3));if(id.startsWith('jelly')&&turn%3===0&&cmd==='attack')return Math.round(base*.5);if(id==='nereis')return Math.round(base*(turn%3===0?(cmd==='fire'?1.2:.45):1.25));return base}
export function enemyAttack(_c:ChapterContext,id:string,turn:number,cmd:string,base:number){if(id.startsWith('moth')&&cmd==='fire')return Math.ceil(base*.55);if(id.startsWith('jelly')&&turn%3===0)return base+6;return base}
export function status(_c:ChapterContext,id:string,turn:number){const next=turn+1;if(id==='shell')return '硬い殻：剣は軽減 ／ 星火が弱点';if(id.startsWith('jelly'))return next%3===0?'濃霧：次の剣は届きにくい。星火が有効':'薄霧：次の剣は通常どおり届く';if(id.startsWith('moth'))return '星火を当てると、そのターンの反撃が弱まる';if(id==='nereis')return next%3===0?'次は消灯：星火で再点灯、または防御':'帰り灯が輝く：次の攻撃が強まる';return '鐘が鳴ったら、次の一撃を防御'}
export function onCommand(c:ChapterContext,id:string,turn:number,cmd:string){if(id!=='nereis')return;const dark=turn%3===0&&cmd!=='fire';for(const lamp of c.world.userData.vigil??[])lamp.material.emissiveIntensity=dark?0:2.1;const fog=c.scene.fog as import('three').FogExp2;fog.density=dark?.037:.023;fog.color.set(dark?'#202d48':'#355b70');if(turn%3===0)c.burst(c.state.x,2,c.state.z,dark?'#65719e':'#ffe0a1',55)}
