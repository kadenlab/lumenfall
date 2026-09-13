import {formallyCompleted,reconcileCompletion} from './chapter-access.ts';
import type {GameState} from './state.ts';
import {chapter2Cleared} from '../trials/state.ts';
import {chapterCatalog,prerequisite} from '../chapters/catalog.ts';
/** Preserve the historical Chapter 2 fallback; all later chapters use formal completion. */
export function chapterCompleted(s:GameState,id:string){return id==='chapter-2'?chapter2Cleared(s):formallyCompleted(s,id)}
export function canAccessChapter(s:GameState,id:string,catalog=chapterCatalog){const prior=prerequisite(id,catalog);return !prior||chapterCompleted(s,prior)}
/** No new chapter progress is created by unlock reconciliation. */
export function migrateChapterUnlocks(s:GameState,catalog=chapterCatalog){
 for(const c of catalog)if(c.reconcileLegacyCompletion)reconcileCompletion(s,c.id);
 for(const c of catalog){if(canAccessChapter(s,c.id,catalog)){if(!s.campaign.unlockedChapters.includes(c.id))s.campaign.unlockedChapters.push(c.id)}else s.campaign.unlockedChapters=s.campaign.unlockedChapters.filter(id=>id!==c.id)}
}
