import type {Chapter} from './types.ts';
import type {Campaign} from '../systems/progression.ts';
import {chapterCatalog,successors} from './catalog.ts';
export {chapterCatalog} from './catalog.ts';
export async function loadChapter(id:string):Promise<Chapter>{
 const metadata=chapterCatalog.find(c=>c.id===id);
 const entry=id==='investigations'?{load:()=>import('../investigations/chapter.ts')}:id==='trials'?{load:()=>import('../trials/chapter.ts')}:metadata;
 if(!entry)throw Error('このチャプターはまだインストールされていません');
 const {default:chapter}=await entry.load();
 if(chapter.id!==id||!chapter.maps.length)throw Error('チャプター定義が正しくありません');
 // Keep module definitions intact; callers and failed-load rollback retain their ownership.
 return metadata?{...chapter,title:metadata.title,start:{...metadata.start},unlockNext:successors(id)}:chapter;
}
export function chapterChoices(c:Campaign){return chapterCatalog.map(m=>({id:m.id,title:m.title,unlocked:c.unlockedChapters.includes(m.id),completed:c.completedChapters.includes(m.id)}))}
