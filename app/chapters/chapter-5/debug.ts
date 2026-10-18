import type {GameState} from '../../systems/state.ts';
import {progress} from '../../systems/progression.ts';
export const names=['Start','Lower City','Office','Conduit','Mine','Part 1 End','Cleared'];
export const mapGates:Record<number,string>={1:'Lower City',2:'Office',3:'Conduit',4:'Mine'};
export function apply(s:GameState,name:string){const p=progress(s.campaign),f=p.flags;if(name==='Start')return 0;
 f.introSeen=f.furnaceFlash=true;p.defeatedEnemies=['ash-eater'];if(name==='Lower City')return 1;
 f.elnaMet=true;if(name==='Office')return 2;if(name==='Conduit')return 3;
 f.puzzleStep=3;f.passageRestored=true;p.unlockedAreas=[0,1,2,3,4];if(name==='Mine')return 4;
 f.baldoMet=f.officeRecord=f.mineRecord=f.towerClue=f.part1Complete=true;p.quests['furnace-flow']='old-tower';
 // Artificial fixture only: normal story never invokes completeChapter or finish.
 if(name==='Cleared'){p.completed=true;f.debugArtificialClear=true}return 1;
}
export const placements=()=>import('./object-config.ts');
