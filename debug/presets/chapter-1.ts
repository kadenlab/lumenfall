import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
export const names=['Start','Before Boss','Cleared'];
export function apply(s:GameState,name:string){const p=progress(s.campaign);if(name==='Start')return 0;Object.assign(p.flags,{storyStage:name==='Cleared'?3:1,'seal:west':true,'seal:east':true,dungeonVersion:1});p.quests['restore-light']=name==='Cleared'?'completed':'active';for(const id of ['sentinel','sentinel-east',...(name==='Cleared'?['boss']:[])])if(!p.defeatedEnemies.includes(id))p.defeatedEnemies.push(id);if(name==='Cleared')p.bosses=['boss'];return 2}
