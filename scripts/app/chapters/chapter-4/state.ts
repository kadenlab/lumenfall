import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
export const flags=(s:GameState)=>progress(s.campaign,'chapter-4').flags;
export const won=(s:GameState,id:string)=>progress(s.campaign,'chapter-4').defeatedEnemies.includes(id);
export const linked=(s:GameState)=>!!flags(s).west&&!!flags(s).east;
export function canEnter(s:GameState,a:number){if(a===0||a===1)return true;if(a===2||a===3)return !!flags(s).briefed;if(a===4)return linked(s);if(a===5)return linked(s)&&won(s,'seawarden');if(a===6)return canEnter(s,5)&&!!flags(s).cut;if(a===7)return canEnter(s,6)&&!!flags(s).van;return false}
