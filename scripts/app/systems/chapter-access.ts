import type {GameState} from './state.ts';
/** Formal completion wins; never infer a new story chapter from a boss alone. */
export function formallyCompleted(s:GameState,id:string){return s.campaign.completedChapters.includes(id)||s.campaign.chapters[id]?.completed===true}
export function reconcileCompletion(s:GameState,id:string){if(!formallyCompleted(s,id))return;const c=s.campaign;if(!c.completedChapters.includes(id))c.completedChapters.push(id);if(c.chapters[id])c.chapters[id].completed=true}
