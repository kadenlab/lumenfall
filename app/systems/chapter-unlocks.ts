import {formallyCompleted,reconcileCompletion} from './chapter-access.ts';
import type {GameState} from './state.ts';
import {chapter2Cleared} from '../trials/state.ts';
/** Additive migration; no new chapter progress is created until it is visited. */
export function migrateChapterUnlocks(s:GameState){
 reconcileCompletion(s,'chapter-3');
 const ids=s.campaign.unlockedChapters;
 if(chapter2Cleared(s)){if(!ids.includes('chapter-3'))ids.push('chapter-3')}
 else s.campaign.unlockedChapters=ids.filter(id=>id!=='chapter-3');
 if(formallyCompleted(s,'chapter-3')){if(!s.campaign.unlockedChapters.includes('chapter-4'))s.campaign.unlockedChapters.push('chapter-4')}else s.campaign.unlockedChapters=s.campaign.unlockedChapters.filter(id=>id!=='chapter-4');
}
