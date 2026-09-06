import {fresh} from '../../systems/state.ts';
import {progress,completeChapter,unlockArea} from '../../systems/progression.ts';
import {dungeonWalkable} from './dungeon.ts';
export function migrateV1(d:any){
 if(d?.version!==1||![0,1,2].includes(d.area)||!Number.isFinite(d.hp)||!Number.isFinite(d.x)||!Number.isFinite(d.z)||!Array.isArray(d.wins)||!Array.isArray(d.chests))throw Error('記録の形式が正しくありません');
 const s=fresh();for(const key of ['area','x','z','hp','mp','lv','xp','gold','potions','ethers','sword','armor','time'] as const)if(d[key]!==undefined)(s as any)[key]=d[key];
 const p=progress(s.campaign);p.chests=d.chests.filter((v:any)=>typeof v==='string');p.defeatedEnemies=d.wins.filter((v:any)=>typeof v==='string');
 const stage=d.quest===3||p.defeatedEnemies.includes('boss')?3:Math.max(0,Math.min(2,Number(d.quest)||0));
 p.flags={storyStage:stage,springUsed:!!d.springUsed,dungeonVersion:1};const seals=Array.isArray(d.seals)?d.seals.filter((v:string)=>['west','east'].includes(v)):[];
 for(const id of seals)p.flags['seal:'+id]=true;p.quests['restore-light']=stage===3?'completed':stage?'active':'not-started';
 for(let a=0;a<=s.area;a++)unlockArea(s.campaign,a);
 if(stage===3){p.bosses=['boss'];completeChapter(s.campaign,['chapter-2']);p.unlockedAreas=[0,1,2]}
 if(s.area===2&&(d.dungeonVersion!==1||!dungeonWalkable(s.x,s.z,seals,stage))){s.x=0;s.z=18}
 return s;
}
