import {formallyCompleted} from './chapter-access.ts';
import {chapter2Cleared,TRIAL_CHAPTER} from '../trials/state.ts';
import {progress} from './progression.ts';
import type {GameState} from './state.ts';
/** Pure switch preparation: failure to load the target never mutates the live campaign. */
export function prepareChapterSwitch(state:GameState,id:string,start:{area:number;x:number;z:number}){
 if((id===TRIAL_CHAPTER||id==='chapter-3')&&!chapter2Cleared(state))throw Error('Chapter 2クリア後に解放されます');
 if(id==='chapter-4'&&!formallyCompleted(state,'chapter-3'))throw Error('Chapter 3クリア後に解放されます');
 if(!state.campaign.unlockedChapters.includes(id))throw Error('まだ解放されていないチャプターです');
 const next=structuredClone(state);progress(next.campaign).position={area:next.area,x:next.x,z:next.z};
 next.campaign.currentChapter=id;const p=progress(next.campaign);Object.assign(next,p.position??start);return next;
}
