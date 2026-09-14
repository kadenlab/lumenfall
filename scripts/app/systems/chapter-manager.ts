import {canAccessChapter} from './chapter-unlocks.ts';
import {prerequisite} from '../chapters/catalog.ts';
import {progress} from './progression.ts';
import type {GameState} from './state.ts';
/** Pure switch preparation: failure to load the target never mutates the live campaign. */
export function prepareChapterSwitch(state:GameState,id:string,start:{area:number;x:number;z:number}){
 if(!canAccessChapter(state,id))throw Error((prerequisite(id)?.replace('chapter-','Chapter ')??'前提Chapter')+'クリア後に解放されます');
 if(!state.campaign.unlockedChapters.includes(id))throw Error('まだ解放されていないチャプターです');
 const next=structuredClone(state);progress(next.campaign).position={area:next.area,x:next.x,z:next.z};
 next.campaign.currentChapter=id;const p=progress(next.campaign);Object.assign(next,p.position??start);return next;
}
