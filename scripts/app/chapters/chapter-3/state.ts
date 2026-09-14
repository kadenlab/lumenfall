import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
export const flags=(s:GameState)=>progress(s.campaign,'chapter-3').flags;
export const won=(s:GameState,id:string)=>progress(s.campaign,'chapter-3').defeatedEnemies.includes(id);
export const warmed=(s:GameState)=>!!flags(s)['hearth-west']&&!!flags(s)['hearth-east'];
export const ready=(s:GameState)=>!!flags(s).record&&warmed(s);
export function canEnter(s:GameState,area:number){
 if(area===0||area===1)return true;
 if(area===2)return won(s,'warden');
 if(area===3)return won(s,'warden')&&!!flags(s).evidence;
 return area===4&&won(s,'warden')&&!!flags(s).evidence&&ready(s);
}
