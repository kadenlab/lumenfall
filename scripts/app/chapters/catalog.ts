import type {Chapter} from './types.ts';
import type {GameState} from '../systems/state.ts';
export type DebugDefinition={prepareTravel?:(s:GameState,area:number)=>void;names:string[];apply:(s:GameState,name:string)=>number;mapGates:Record<number,string>;placements:()=>Promise<{placements:Record<number,any[]>}>};
export type ChapterMetadata={id:string;title:string;order:number;requires?:string;reconcileLegacyCompletion?:boolean;start:{area:number;x:number;z:number};load:()=>Promise<{default:Chapter}>;debug:()=>Promise<DebugDefinition>};
/** Lightweight catalog only: chapter/map/debug code stays behind import functions. */
export function defineCatalog(entries:ChapterMetadata[]):ChapterMetadata[]{
 const ids=new Set<string>(),orders=new Set<number>();
 for(const e of entries){if(ids.has(e.id)||orders.has(e.order)||!Number.isInteger(e.order)||e.order<1||!e.title||!Number.isInteger(e.start.area)||![e.start.x,e.start.z].every(Number.isFinite)||typeof e.load!=='function'||typeof e.debug!=='function')throw Error('Invalid chapter metadata: '+e.id);ids.add(e.id);orders.add(e.order)}
 for(const e of entries)if(e.requires&&!entries.some(p=>p.id===e.requires&&p.order<e.order))throw Error('Invalid chapter prerequisite: '+e.id);
 return [...entries].sort((a,b)=>a.order-b.order);
}
export const chapterCatalog=defineCatalog([
 {id:'chapter-1',order:1,requires:undefined,start:{area:0,x:0,z:8},debug:()=>import('../debug/presets/chapter-1.ts'),title:'Chapter 1 — 灯の継承者',load:()=>import('./chapter-1/chapter-config.ts')},
 {id:'chapter-2',order:2,requires:'chapter-1',start:{area:0,x:0,z:16},debug:()=>import('../debug/presets/chapter-2.ts'),title:'Chapter 2 — 帰り灯の海',load:()=>import('./chapter-2/chapter-config.ts')},
 {id:'chapter-3',reconcileLegacyCompletion:true,order:3,requires:'chapter-2',start:{area:0,x:0,z:17},debug:()=>import('../debug/presets/chapter-3.ts'),title:'Chapter 3 — 雪に閉ざされた灯',load:()=>import('./chapter-3/chapter-config.ts')},
 {id:'chapter-4',order:4,requires:'chapter-3',start:{area:0,x:0,z:17},debug:()=>import('../debug/presets/chapter-4.ts'),title:'Chapter 4 — 無音の環海',load:()=>import('./chapter-4/chapter-config.ts')}
]);
export function prerequisite(id:string,catalog=chapterCatalog){return id==='investigations'?'chapter-4':id==='trials'?'chapter-2':catalog.find(c=>c.id===id)?.requires}
export function successors(id:string,catalog=chapterCatalog){return catalog.filter(c=>c.requires===id).map(c=>c.id)}
export function ancestors(id:string,catalog=chapterCatalog):string[]{const prior=prerequisite(id,catalog);return prior?[...ancestors(prior,catalog),prior]:[]}
