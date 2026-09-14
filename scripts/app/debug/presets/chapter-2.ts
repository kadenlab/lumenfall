import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
export const names=['Start','Bridge Open','Before Bellwarden','Before Nereis','Cleared'];
export function apply(s:GameState,name:string){const p=progress(s.campaign);if(name==='Start')return 0;Object.assign(p.flags,{briefed:true,'clue-bell':true,'clue-boat':true,'clue-star':true,permit:true,beacons:3});p.quests['missing-lights']='crossing';if(name==='Bridge Open')return 1;Object.assign(p.flags,{'nave-west':true,'nave-east':true});if(name==='Before Bellwarden')return 2;if(!p.defeatedEnemies.includes('bellwarden'))p.defeatedEnemies.push('bellwarden');if(!p.bosses.includes('bellwarden'))p.bosses.push('bellwarden');Object.assign(p.flags,{'vigil-west':true,'vigil-east':true,'vigil-heart':true,rested:true});p.quests['missing-lights']='choir';if(name==='Cleared'){p.flags.starGlass=true;p.quests['missing-lights']='complete';p.bosses.push('nereis');p.defeatedEnemies.push('nereis')}return 3}

export const mapGates:Record<number,string>={1:'Bridge Open',2:'Before Bellwarden',3:'Before Nereis'};
export const placements=()=>import('../../chapters/chapter-2/object-config.ts');
