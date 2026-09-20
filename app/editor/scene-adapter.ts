import * as T from 'three';
import {chapterCatalog} from '../chapters/catalog.ts';
import {loadChapter} from '../chapters/registry.ts';
import {travel} from '../debug/debug-actions.ts';
import {fresh} from '../systems/state.ts';
import {progress} from '../systems/progression.ts';
import type {ChapterContext} from '../chapters/types.ts';
import type {EditorDocument,EditorObject} from './model.ts';

export const editorChapters=()=>[...chapterCatalog.map(c=>({id:c.id,title:c.title})),{id:'trials',title:'灯の試練'},{id:'investigations',title:'灯路異変調査'}];
export function disposeTree(root:T.Object3D){const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>(),ts=new Set<T.Texture>();root.traverse((o:any)=>{if(o.geometry)gs.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){ms.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)ts.add(v)}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose())}
export async function buildEditorScene(chapterId:string,mapId:number){
 const chapter=await loadChapter(chapterId),map=chapter.maps.find(m=>m.id===mapId);if(!map)throw Error('Unknown map');
 // Fresh scratch progress only. No normal/DEBUG save is read or written.
 const state=await travel(fresh(),chapterId,mapId),loaded=await map.load();
 const scene=new T.Scene(),world=new T.Group();scene.add(world);const ambient=new T.HemisphereLight('#c3e1ef','#384538',2),sun=new T.DirectionalLight('#ffcf85',4);sun.position.set(-14,25,9);scene.add(ambient,sun);
 const materials=new Set<T.Material>();const mat=(color:string,roughness=.9)=>{const m=new T.MeshStandardMaterial({color,roughness});materials.add(m);return m};
 const mats=Object.fromEntries(Object.entries({stone:'#8b9186',dark:'#505d58',wall:'#ddcba6',wood:'#665044',roof:'#487573',gold:'#b38a45',ground:'#647b46',path:'#b4a17a'}).map(([k,v])=>[k,mat(v)]));
 const objects:ChapterContext['objects']=[],blocks:ChapterContext['blocks']=[],height=(x:number,z:number)=>chapter.height(state,x,z);
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const a=new T.Mesh(new T.BoxGeometry(w,h,d),m);a.position.set(x,y,z);world.add(a);return a};
 const cyl=(x:number,y:number,z:number,r:number,h:number,m:T.Material,n=8)=>{const a=new T.Mesh(new T.CylinderGeometry(r,r*1.08,h,n),m);a.position.set(x,y,z);world.add(a);return a};
 const addObj=(kind:string,name:string,x:number,z:number,id=kind)=>{const o={kind,name,x,z,id,r:2.3};objects.push(o);return o};
 const sprite=(kind:string,x:number,z:number,scale=2.2)=>{const sp=new T.Sprite(new T.SpriteMaterial({color:'#e8c58c'}));sp.position.set(x,height(x,z),z);sp.scale.set(scale*.75,scale,1);sp.center.set(.5,0);world.add(sp);return sp};
 const tree=(x:number,z:number,scale=1)=>{const y=height(x,z);cyl(x,y+1.6*scale,z,.23*scale,3.2*scale,mats.wood);const a=new T.Mesh(new T.ConeGeometry(1.8*scale,4*scale,7),mat('#466c49'));a.position.set(x,y+4*scale,z);world.add(a);blocks.push({x,z,w:.6*scale,d:.6*scale})};
 const house=(x:number,z:number,w:number,d:number)=>{box(x,1.5,z,w,3,d,mats.wall);box(x,3.1,z,w+.5,.4,d+.5,mats.roof);blocks.push({x,z,w:w+.3,d:d+.3})};
 const noEffect=()=>{};const ctx:ChapterContext={sceneryOnly:true,state,progress:progress(state.campaign),world,scene,ambient,sun,objects,blocks,mats,animationTime:{value:0},mobile:false,modal:'',mode:'editor',clock:0,muted:true,companion:new T.Sprite(),
  box,cyl,mat,house,tree,sprite,addObj,height,rand:n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)},
  water:(x,z,w,d,level=-.22)=>box(x,level,z,w,.05,d,mat('#376474',.4)),torch:(x,z)=>cyl(x,height(x,z)+.8,z,.09,1.6,mats.wood),light:noEffect,
  chest:(x,z,id)=>{const o=addObj('chest','宝箱',x,z,id);(o as any).mesh=box(x,height(x,z)+.35,z,.8,.6,.65,mats.gold)},exitMarker:noEffect,reskin:noEffect,
  build:noEffect,save:noEffect,notify:noEffect,talk:noEffect,renderUI:noEffect,burst:noEffect,transition:async()=>{},startBattle:noEffect,maxHP:()=>100,maxMP:()=>30,switchChapter:async()=>{},btn:()=>'',finish:noEffect};
 try{loaded.build(ctx)}catch(e){disposeTree(scene);materials.forEach(m=>m.dispose());throw e}
 const rows:EditorObject[]=[{id:'player-start',kind:'player-start',name:'Player Start',x:map.spawn.x,z:map.spawn.z,source:'existing'}];
 const add=(p:any,sourceType='object')=>{const id=sourceType+':'+p.id;if(rows.some(o=>o.id===id))return;
  rows.push({id,kind:p.kind==='previous'?'exit':p.kind??'prop',name:p.name??p.id,x:p.x,z:p.z,radius:p.r??(p.kind==='boss'?3.3:2.3),source:'existing',metadata:{gameId:p.id,placementKind:p.kind,...(p.sprite?{sprite:p.sprite}:{}),...(p.scale?{scale:p.scale}:{}),...(p.destination!==undefined?{destination:p.destination}:{})}})};
 for(const o of objects){if(o.mesh)o.mesh.visible=false;add(o)}world.traverse(o=>{if(o instanceof T.Sprite)o.visible=false});
 const meta=chapterCatalog.find(c=>c.id===chapterId);
 if(meta){const data:any=await (await meta.debug()).placements();
  // Chapter 1's older DEBUG adapter omits its treasure table. Keep this compatibility local.
  if(chapterId==='chapter-1')data.treasures=(await import('../chapters/chapter-1/object-config.ts')).treasures;for(const p of data.placements[mapId]??[])add(p);for(const [id,t]of Object.entries(data.treasures??{}) as [string,any][])if(t.area===mapId)add({...t,id,kind:'chest',name:t.name??'宝箱'},'chest')}
 const document:EditorDocument={version:1,chapterId,mapId,objects:rows};
 return {scene,document,blocks,height,map,chapter,dispose(){disposeTree(scene);materials.forEach(m=>m.dispose())}};
}
