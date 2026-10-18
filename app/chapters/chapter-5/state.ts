import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
export const flags=(s:GameState)=>progress(s.campaign,'chapter-5').flags;
export const won=(s:GameState,id:string)=>progress(s.campaign,'chapter-5').defeatedEnemies.includes(id);
export function canEnter(s:GameState,area:number){return area===0||area===1||((area===2||area===3)&&!!flags(s).elnaMet)||area===4&&!!flags(s).passageRestored}
export function syncQuest(s:GameState){const p=progress(s.campaign,'chapter-5'),f=p.flags;
 p.quests['furnace-flow']=f.part1Complete?'old-tower':f.officeRecord&&f.mineRecord?'report':f.mineRecord?'office-record':f.officeRecord?'mine-record':f.elnaMet?'investigate':'arrival';
}
export const sequence=['cooling','distribution','power'];
export function operate(s:GameState,id:string){const p=progress(s.campaign,'chapter-5'),f=p.flags;if(f.passageRestored)return 'open';
 const step=Number(f.puzzleStep)||0;if(sequence[step]!==id){f.puzzleStep=0;return 'reset'}
 f.puzzleStep=step+1;if(step===2){f.passageRestored=true;if(!p.unlockedAreas.includes(4))p.unlockedAreas.push(4);return 'open'}return 'next';
}
