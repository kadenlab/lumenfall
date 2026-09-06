export type ChapterProgress = {
 completed:boolean; flags:Record<string,boolean|number|string>; bosses:string[];
 defeatedEnemies:string[]; chests:string[]; quests:Record<string,string>;
 unlockedAreas:number[]; position?:{area:number;x:number;z:number};
};
export type Campaign={currentChapter:string;completedChapters:string[];unlockedChapters:string[];chapters:Record<string,ChapterProgress>};
export function createProgress():ChapterProgress{return {completed:false,flags:{},bosses:[],defeatedEnemies:[],chests:[],quests:{},unlockedAreas:[]}}
export function createCampaign(first='chapter-1'):Campaign{return {currentChapter:first,completedChapters:[],unlockedChapters:[first],chapters:{[first]:createProgress()}}}
export function progress(c:Campaign,id=c.currentChapter){return c.chapters[id]??(c.chapters[id]=createProgress())}
export function completeChapter(c:Campaign,next:string[]=[]){const p=progress(c);p.completed=true;if(!c.completedChapters.includes(c.currentChapter))c.completedChapters.push(c.currentChapter);for(const id of next)if(!c.unlockedChapters.includes(id))c.unlockedChapters.push(id)}
export function unlockArea(c:Campaign,area:number){const p=progress(c);if(!p.unlockedAreas.includes(area))p.unlockedAreas.push(area)}
export function recordVictory(c:Campaign,id:string,boss:boolean){const p=progress(c);if(!p.defeatedEnemies.includes(id))p.defeatedEnemies.push(id);if(boss&&!p.bosses.includes(id))p.bosses.push(id)}
