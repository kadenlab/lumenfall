import type {Chapter} from './types.ts';
import type {Campaign} from '../systems/progression.ts';
// Only lightweight metadata is eager. Content and maps are separate dynamic imports.
export const chapterCatalog=[{id:'chapter-1',title:'Chapter 1 — 灯の継承者',load:()=>import('./chapter-1/chapter-config.ts')}];
export async function loadChapter(id:string):Promise<Chapter>{const entry=chapterCatalog.find(c=>c.id===id);if(!entry)throw Error('このチャプターはまだインストールされていません');const {default:chapter}=await entry.load();if(chapter.id!==id||!chapter.maps.length)throw Error('チャプター定義が正しくありません');return chapter}
export function chapterChoices(c:Campaign){return chapterCatalog.map(m=>({id:m.id,title:m.title,unlocked:c.unlockedChapters.includes(m.id),completed:c.completedChapters.includes(m.id)}))}
