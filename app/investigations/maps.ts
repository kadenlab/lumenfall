import * as T from 'three';
import type {Chapter,ChapterContext,MapConfig} from '../chapters/types.ts';
import type {GameState} from '../systems/state.ts';
import {fresh} from '../systems/state.ts';
import {progress} from '../systems/progression.ts';
import {loadChapter} from '../chapters/registry.ts';
import {cases} from './catalog.ts';
const surfaces=new Map<number,{chapter:Chapter;state:GameState}>();
export const height=(s:GameState,x:number,z:number)=>{const a=surfaces.get(s.area);return a?.chapter.height(a.state,x,z)??0};
export const walkable=(s:GameState,x:number,z:number)=>{const a=surfaces.get(s.area);return Math.abs(x)<20.5&&Math.abs(z)<20.5&&!!a?.chapter.walkable(a.state,x,z)};
export const maps:MapConfig[]=cases.map(entry=>({id:entry.id,name:entry.place,eyebrow:'LAMP ROAD INVESTIGATION',description:entry.title,night:entry.id!==0,spawn:{x:0,z:17},load:async()=>{
 const chapter=await loadChapter(entry.chapter),map=chapter.maps.find(m=>m.id===entry.area)!;const source=await map.load();
 // This projection belongs to scenery only; it is never persisted or shared with the player campaign.
 const state=fresh();state.campaign.currentChapter=entry.chapter;state.campaign.completedChapters=['chapter-1','chapter-2','chapter-3','chapter-4'];state.area=entry.area;
 const p=progress(state.campaign);p.completed=true;Object.assign(p.flags,{storyStage:3,beacons:3,briefed:true,history:true,smith:true,watcher:true,evidence:true,record:true,west:true,east:true});
 surfaces.set(entry.id,{chapter,state});
 return {build(c:ChapterContext){
  source.build({...c,state,progress:p,sceneryOnly:true,height:(x,z)=>chapter.height(state,x,z),exitMarker:()=>{}});
  const run=c.state.investigations?.run,active=run?.caseId===entry.id&&!run.resolved;
  c.addObj('exit','調査一覧へ戻る',0,17,'investigation-list');
  const m=new T.MeshStandardMaterial({color:entry.color,emissive:entry.color,emissiveIntensity:1.1,roughness:.45});
  for(const [i,x,z]of [[0,-3,10],[1,3,3],[2,0,-5]]){const y=c.height(x,z);c.cyl(x,y+.45,z,.25,.9,m,6);const o=c.addObj('trace',`灯路の痕跡 ${i+1}`,x,z,'trace-'+i);o.r=2.6;if(run?.clues.includes(i))c.cyl(x,y+.98,z,.1,.15,m,6)}
  if(active){const o=c.addObj('boss',entry.name,0,-14,entry.enemy);o.r=3.1;o.mesh=c.sprite(entry.enemy,0,-14,entry.id===3?2.8:2.4)}
  c.exitMarker(0,17,'調査一覧');
 }};
}}));
