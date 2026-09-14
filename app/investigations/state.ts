import type {GameState} from '../systems/state.ts';
import {formallyCompleted} from '../systems/chapter-access.ts';
import {INVESTIGATIONS,cases,caseById} from './catalog.ts';
export type InvestigationState={unlocked:boolean;introduced:boolean;cleared:number[];rewarded:number[];xpRewarded:number[];goldRewarded:number[];allRewarded:boolean;run?:{caseId:number;clues:number[];resolved:boolean}};
export const investigationUnlocked=(s:GameState)=>formallyCompleted(s,'chapter-4');
export function migrateInvestigations(s:GameState){
 const old=s.investigations;const n=s.investigations={...{unlocked:false,introduced:false,cleared:[],rewarded:[],xpRewarded:[],goldRewarded:[],allRewarded:false},...old};
 for(const k of ['cleared','rewarded','xpRewarded','goldRewarded'] as const)n[k]=Array.isArray(n[k])?[...new Set(n[k].filter(id=>cases.some(c=>c.id===id)))]:[];
 n.unlocked=investigationUnlocked(s);n.introduced=!!n.introduced;n.allRewarded=!!n.allRewarded;
 if(n.run){if(!cases.some(c=>c.id===n.run?.caseId))delete n.run;else n.run={caseId:n.run.caseId,clues:Array.isArray(n.run.clues)?[...new Set(n.run.clues.filter(x=>[0,1,2].includes(x)))]:[],resolved:!!n.run.resolved}}
 const ids=s.campaign.unlockedChapters;if(n.unlocked){if(!ids.includes(INVESTIGATIONS))ids.push(INVESTIGATIONS)}else s.campaign.unlockedChapters=ids.filter(id=>id!==INVESTIGATIONS);
 return n;
}
export function startCase(s:GameState,id:number){if(!investigationUnlocked(s))throw Error('Chapter 4クリア後に解放されます');caseById(id);const n=migrateInvestigations(s);n.run={caseId:id,clues:[],resolved:false};return n.run}
export function scan(s:GameState,index:number){const r=s.investigations?.run;if(!r||r.resolved||![0,1,2].includes(index))return false;if(!r.clues.includes(index))r.clues.push(index);return true}
export const ready=(s:GameState)=>!!s.investigations?.run&&!s.investigations.run.resolved&&s.investigations.run.clues.length===3;
