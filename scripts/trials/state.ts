import type {GameState} from '../systems/state.ts';
export const TRIAL_CHAPTER='trials';
export const accessories=[
 {id:'warden',name:'灯守の指輪',effect:'防御力 +8%'},
 {id:'afterglow',name:'残光のペンダント',effect:'攻撃力 +8%'},
 {id:'mist',name:'霧灯の護符',effect:'最大HP +10%'},
 {id:'phantom',name:'幻灯の耳飾り',effect:'回避率 +8%'},
 {id:'eternal',name:'永灯の首飾り',effect:'ターン開始時 最大HPの3%回復'},
];
export type TrialState={unlocked:boolean;notified:boolean;cleared:number[];unlockedTrials:number[];owned:string[];slots:(string|null)[];best:Record<string,{turns:number;hp:number}>};
export function freshTrials():TrialState{return {unlocked:false,notified:false,cleared:[],unlockedTrials:[],owned:[],slots:[null,null],best:{}}}
/** Existing authoritative completion fields take precedence. Never infer completion from arrival alone. */
export function chapter2Cleared(s:GameState){const c=s.campaign,p=c.chapters['chapter-2'];
 if(c.completedChapters.includes('chapter-2')||p?.completed===true)return true;
 if(p&&typeof p.completed==='boolean')return false;
 return !!(p?.bosses?.includes('nereis')&&p?.flags?.starGlass&&p?.quests?.['missing-lights']==='complete');
}
export function migrateTrials(s:GameState){const old=s.trials as Partial<TrialState>|undefined;const t=s.trials={...freshTrials(),...old};
 t.cleared=Array.isArray(t.cleared)?[...new Set(t.cleared.filter(n=>Number.isInteger(n)&&n>=1&&n<=5))]:[];
 t.owned=Array.isArray(t.owned)?t.owned.filter(id=>accessories.some(a=>a.id===id)):[];
 t.best=t.best&&typeof t.best==='object'?t.best:{};
 t.slots=Array.isArray(t.slots)?t.slots.slice(0,2):[null,null];while(t.slots.length<2)t.slots.push(null);
 for(let i=0;i<2;i++)if(!t.owned.includes(t.slots[i]!)||(i===1&&t.slots[0]===t.slots[1]))t.slots[i]=null;
 t.unlocked=chapter2Cleared(s);t.notified=!!t.notified;
 t.unlockedTrials=t.unlocked?[1,2,3,4,5].filter(n=>n===1||Array.from({length:n-1},(_,i)=>i+1).every(i=>t.cleared.includes(i))):[];
 if(t.unlocked&&!s.campaign.unlockedChapters.includes(TRIAL_CHAPTER))s.campaign.unlockedChapters.push(TRIAL_CHAPTER);
 if(!t.unlocked)s.campaign.unlockedChapters=s.campaign.unlockedChapters.filter(id=>id!==TRIAL_CHAPTER);
 return t;
}
export function takeUnlockNotice(s:GameState){const t=migrateTrials(s);if(!t.unlocked||t.notified)return false;t.notified=true;return true}
export function equipped(s:GameState,id:string){return !!s.trials?.slots.includes(id)}
export function maxHealth(s:GameState){return Math.floor((100+(s.lv-1)*24)*(equipped(s,'mist')?1.1:1))}
export function attackBonus(s:GameState,n:number){return Math.round(n*(equipped(s,'afterglow')?1.08:1))}
// The original game has flat armor mitigation, not a defense stat. +8% defense reduces incoming damage by 1/1.08.
export function incoming(s:GameState,n:number,guard=false,rng=Math.random){if(equipped(s,'phantom')&&rng()<.08)return 0;return Math.max(1,Math.ceil(Math.max(1,n-(s.armor?5:0))/(equipped(s,'warden')?1.08:1)*(guard?.25:1)))}
export function regenerate(s:GameState,blocked=false){if(blocked||s.hp<=0||!equipped(s,'eternal'))return 0;const n=Math.min(maxHealth(s)-s.hp,Math.max(1,Math.floor(maxHealth(s)*.03)));s.hp+=Math.max(0,n);return Math.max(0,n)}
export function equip(s:GameState,slot:number,id:string|null){const t=migrateTrials(s);if(slot!==0&&slot!==1)return false;if(id&&(!t.owned.includes(id)||t.slots[1-slot]===id))return false;t.slots[slot]=id;s.hp=Math.min(s.hp,maxHealth(s));return true}
export function reward(s:GameState,id:number,turns:number,hp:number){const t=migrateTrials(s);if(!t.unlockedTrials.includes(id))return false;const first=!t.cleared.includes(id);if(first){t.cleared.push(id);const item=accessories[id-1].id;if(!t.owned.includes(item))t.owned.push(item)}const b=t.best[id];if(!b||turns<b.turns||turns===b.turns&&hp>b.hp)t.best[id]={turns,hp};migrateTrials(s);return first}
