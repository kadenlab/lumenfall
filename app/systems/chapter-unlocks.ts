import type {GameState} from './state.ts';
import {chapter2Cleared} from '../trials/state.ts';
/** Additive migration; no new chapter progress is created until it is visited. */
export function migrateChapterUnlocks(s:GameState){
 const ids=s.campaign.unlockedChapters;
 if(chapter2Cleared(s)){if(!ids.includes('chapter-3'))ids.push('chapter-3')}
 else s.campaign.unlockedChapters=ids.filter(id=>id!=='chapter-3');
}
