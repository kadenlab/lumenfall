import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import {loadChapter} from '../chapters/registry.ts';
import {buildEditorScene,editorChapters,disposeTree} from './scene-adapter.ts';
import {addDraft,deleteObject,moveObject,updateObject,exportJSON,exportTS,saveDraft,loadDraft,clearDraft,teleportPayload} from './model.ts';
import type {EditorDocument,EditorObject} from './model.ts';

export async function mountEditor(){
 const root=document.createElement('main');root.id='lumenfall-editor';root.dataset.build='LUMENFALL_EDITOR_DEV_ONLY';
 root.innerHTML=`<header><h1>Lumenfall Editor <small>v0.1 · DEV ONLY</small></h1><label>Chapter <select id="ed-chapter"></select></label><label>Map <select id="ed-map"></select></label></header>
 <nav aria-label="Editor tools"><label><input id="ed-grid" type="checkbox" checked> Grid</label><label>Snap <select id="ed-snap"><option value="0">OFF</option><option value="0.25">0.25</option><option value="0.5" selected>0.5</option><option value="1">1.0</option></select></label><label><input id="ed-collision" type="checkbox"> Collision</label><button id="ed-frame">Frame selected</button><button id="ed-save">Save Draft</button><button id="ed-load">Load Draft</button><button id="ed-clear">Clear Draft</button><button id="ed-json">JSON Export</button><button id="ed-ts">TypeScript Export</button><button id="ed-play">Copy DEBUG teleport</button></nav>
 <aside class="ed-hierarchy"><h2>Hierarchy</h2><div id="ed-list"></div><label>Draft kind <select id="ed-kind"><option>npc</option><option>enemy</option><option>chest</option><option>prop</option></select></label><button id="ed-add">Add Draft</button><button id="ed-delete">Delete selected</button></aside>
 <section id="ed-view" aria-label="Scene View"><div class="ed-hint">Orbit: left drag · Pan: right drag · Zoom: wheel<br>配置は色付きマーカー。地形Yに追従。ソース・ゲームsaveは変更しません。</div></section>
 <aside class="ed-inspector"><h2>Inspector</h2><fieldset id="ed-fields" disabled><label>ID <input id="ed-id" readonly></label><label>Name <input id="ed-name"></label><label>Kind <input id="ed-type" readonly></label><label>X <input id="ed-x" type="number" step="0.25"></label><label>Z <input id="ed-z" type="number" step="0.25"></label><label>Radius <input id="ed-radius" type="number" min="0" step="0.25"></label><label>Source <input id="ed-source" readonly></label></fieldset><p>Move gizmoはX/Zのみ。Yはマップの高さです。Draftのイベント・敵・報酬定義は実装者が追加してください。</p></aside>
 <footer role="status" id="ed-status">Loading…</footer><dialog id="ed-export"><h2 id="ed-export-title">Export</h2><textarea id="ed-output" aria-label="Export output" readonly></textarea><div><button id="ed-copy">Copy</button><button id="ed-download">Download</button><button id="ed-close">Close</button></div></dialog>`;
 document.body.append(root);
 const el=<E extends HTMLElement=HTMLElement>(id:string)=>root.querySelector('#ed-'+id) as E;
 const status=(message:string)=>{el('status').textContent=message};
 const chapterSelect=el<HTMLSelectElement>('chapter'),mapSelect=el<HTMLSelectElement>('map'),view=el('view');
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor('#0a1420');renderer.domElement.setAttribute('aria-label','Editor Scene canvas');view.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(45,1,.1,300);camera.position.set(24,30,34);
 const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,0,0);orbit.enableDamping=true;
 const transform=new TransformControls(camera,renderer.domElement);transform.setMode('translate');transform.showY=false;transform.setTranslationSnap(.5);
 const helper=transform.getHelper(),markers=new T.Group(),collision=new T.Group(),grid=new T.GridHelper(48,96,'#7794a4','#31434e');grid.position.y=.04;
 let active:Awaited<ReturnType<typeof buildEditorScene>>|undefined,doc:EditorDocument,selected='',dirty=false,loading=false,version=0,dead=false,raf=0,exportName='placements.json';
 const meshes=new Map<string,T.Group>();let selection:T.BoxHelper|undefined;
 const colors:Record<string,string>={'player-start':'#7ad7ff',enemy:'#ed8d75',boss:'#df82f4',chest:'#f0d38b',exit:'#82e4b4',prop:'#98a6b8'};
 const clearGroup=(g:T.Group)=>{disposeTree(g);g.clear()};
 function collisionView(){clearGroup(collision);if(!active)return;
  for(const b of active.blocks){const mesh=new T.Mesh(new T.BoxGeometry(b.w,1.4,b.d),new T.MeshBasicMaterial({color:'#ff6464',wireframe:true}));mesh.position.set(b.x,active.height(b.x,b.z)+.7,b.z);collision.add(mesh)}
  for(const o of doc.objects)if(o.radius){const ring=new T.Mesh(new T.RingGeometry(Math.max(0,o.radius-.025),o.radius+.025,48),new T.MeshBasicMaterial({color:'#ffc567',side:T.DoubleSide,depthTest:false}));ring.rotation.x=-Math.PI/2;ring.position.set(o.x,active.height(o.x,o.z)+.08,o.z);collision.add(ring)}
 }
 function inspect(){const o=doc?.objects.find(o=>o.id===selected);el<HTMLFieldSetElement>('fields').disabled=!o;for(const [field,key]of [['id','id'],['name','name'],['type','kind'],['x','x'],['z','z'],['radius','radius'],['source','source']])el<HTMLInputElement>(field).value=o?String((o as any)[key]??''):'';el<HTMLButtonElement>('delete').disabled=!o;el<HTMLButtonElement>('play').disabled=!o;}
 function select(id:string){selected=id;transform.detach();if(selection){selection.removeFromParent();selection.geometry.dispose();(selection.material as T.Material).dispose();selection=undefined}const mesh=meshes.get(id);if(mesh){transform.attach(mesh);selection=new T.BoxHelper(mesh,'#ffe2a0');active!.scene.add(selection)}for(const b of el('list').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.id===id));inspect()}
 function redraw(){transform.detach();if(selection){selection.removeFromParent();selection.geometry.dispose();(selection.material as T.Material).dispose();selection=undefined}clearGroup(markers);meshes.clear();el('list').replaceChildren();
  for(const o of doc.objects){const mesh=new T.Group();mesh.userData.editorId=o.id;const mat=new T.MeshStandardMaterial({color:colors[o.kind]??'#8ebed0'});const shape=new T.Mesh(o.kind==='chest'?new T.BoxGeometry(.9,.65,.7):new T.CylinderGeometry(.25,.55,1.5,6),mat);shape.position.y=o.kind==='chest'?.325:.75;mesh.add(shape);mesh.position.set(o.x,active!.height(o.x,o.z),o.z);markers.add(mesh);meshes.set(o.id,mesh);const b=document.createElement('button');b.textContent=`${o.kind} · ${o.name}`;b.dataset.id=o.id;b.onclick=()=>select(o.id);el('list').append(b)}
  collisionView();select(doc.objects.some(o=>o.id===selected)?selected:doc.objects[0]?.id??'');
 }
 function changed(o:EditorObject){dirty=true;for(const b of el('list').querySelectorAll('button'))if(b.dataset.id===o.id)b.textContent=`${o.kind} · ${o.name}`;const mesh=meshes.get(o.id);if(mesh)mesh.position.set(o.x,active!.height(o.x,o.z),o.z);selection?.update();collisionView();inspect();status('Draft changed — ソースは未変更。Exportで取り出してください。')}
 async function openMap(chapterId:string,mapId:number,replacement?:EditorDocument){
  if(loading)return;loading=true;chapterSelect.disabled=mapSelect.disabled=true;el<HTMLFieldSetElement>('fields').disabled=true;status('Loading scenery…');const ticket=++version;
  try{const next=await buildEditorScene(chapterId,mapId);if(dead||ticket!==version){next.dispose();return}transform.detach();if(active){markers.removeFromParent();collision.removeFromParent();grid.removeFromParent();helper.removeFromParent();active.dispose()}active=next;doc=replacement??next.document;selected='';dirty=false;
   active.scene.add(markers,collision,grid,helper);chapterSelect.value=chapterId;mapSelect.replaceChildren();for(const m of active.chapter.maps){const option=new Option(`${m.id} · ${m.name}`,String(m.id));mapSelect.add(option)}mapSelect.value=String(mapId);redraw();orbit.target.set(0,0,0);camera.position.set(24,30,34);orbit.update();status(`${doc.objects.length} placements / ${active.blocks.length} blocks · ${next.map.name}`);
  }catch(e){status('読み込み失敗: '+(e as Error).message);if(active){chapterSelect.value=active.document.chapterId;mapSelect.value=String(active.document.mapId)}}finally{loading=false;chapterSelect.disabled=mapSelect.disabled=false;inspect()}
 }
 const discard=()=>!dirty||confirm('未保存のEditor変更を破棄して移動しますか？');
 chapterSelect.onchange=async()=>{if(!discard()){chapterSelect.value=doc.chapterId;return}try{const c=await loadChapter(chapterSelect.value);await openMap(c.id,c.maps[0].id)}catch(e){status(String(e));chapterSelect.value=doc.chapterId}};
 mapSelect.onchange=()=>{if(!discard()){mapSelect.value=String(doc.mapId);return}void openMap(chapterSelect.value,Number(mapSelect.value))};
 for(const [field,key]of [['x','x'],['z','z'],['radius','radius'],['name','name']] as const)el<HTMLInputElement>(field).onchange=()=>{if(!doc||loading)return;try{const input=el<HTMLInputElement>(field);if(key!=='name'&&!input.value.trim())throw Error('数値を入力してください');changed(updateObject(doc,selected,{[key]:key==='name'?input.value:Number(input.value)}))}catch(e){status(String(e));inspect()}};
 transform.addEventListener('dragging-changed',e=>{orbit.enabled=!e.value});transform.addEventListener('objectChange',()=>{const mesh=transform.object;if(!mesh||!doc)return;const o=moveObject(doc,selected,mesh.position.x,mesh.position.z,Number(el<HTMLSelectElement>('snap').value));changed(o)});
 el<HTMLSelectElement>('snap').onchange=()=>transform.setTranslationSnap(Number(el<HTMLSelectElement>('snap').value)||null);
 el<HTMLInputElement>('grid').onchange=()=>{grid.visible=el<HTMLInputElement>('grid').checked};el<HTMLInputElement>('collision').onchange=()=>{collision.visible=el<HTMLInputElement>('collision').checked};collision.visible=false;
 let pointer:T.Vector2|undefined;renderer.domElement.addEventListener('pointerdown',e=>{if(e.button===0)pointer=new T.Vector2(e.clientX,e.clientY)});
 renderer.domElement.addEventListener('pointerup',e=>{if(!pointer||pointer.distanceTo(new T.Vector2(e.clientX,e.clientY))>4||transform.dragging||transform.axis){pointer=undefined;return}pointer=undefined;const rect=renderer.domElement.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(markers.children,true)[0];if(hit){let o:T.Object3D|null=hit.object;while(o&&!o.userData.editorId)o=o.parent;if(o)select(o.userData.editorId)}});
 el('frame').onclick=()=>{const m=meshes.get(selected);if(m){const offset=camera.position.clone().sub(orbit.target);orbit.target.copy(m.position);camera.position.copy(m.position).add(offset);orbit.update()}};
 el('add').onclick=()=>{if(!doc||loading)return;const o=addDraft(doc,el<HTMLSelectElement>('kind').value);selected=o.id;dirty=true;redraw();status('Draft追加。イベント・敵・報酬定義は別途必要です。')};
 el('delete').onclick=()=>{if(!doc||loading)return;const o=doc.objects.find(o=>o.id===selected);if(!o)return;const ok=o.source==='draft'||confirm('既存の重要配置をEditor draftから削除します。元ソースは残ります。続行しますか？');if(ok){deleteObject(doc,selected,true);dirty=true;redraw();status('Editor draftから削除しました')}};
 const safely=(f:()=>void)=>{try{f()}catch(e){status((e as Error).message)}};
 el('save').onclick=()=>safely(()=>{if(!doc||loading)return;saveDraft(localStorage,doc);dirty=false;status('Editor専用draftを保存しました')});
 el('load').onclick=()=>safely(()=>{if(loading||!discard())return;const d=loadDraft(localStorage);if(d)void openMap(d.chapterId,d.mapId,d);else status('保存済みEditor draftがありません')});
 el('clear').onclick=()=>safely(()=>{clearDraft(localStorage);status('保存済みEditor draftのみ削除しました。表示中の編集は残ります。')});
 const showExport=(text:string,title:string,name:string)=>{el<HTMLTextAreaElement>('output').value=text;el('export-title').textContent=title;exportName=name;el<HTMLDialogElement>('export').showModal()};
 el('json').onclick=()=>{if(doc&&!loading)showExport(exportJSON(doc),'JSON Export','placements.json')};el('ts').onclick=()=>{if(doc&&!loading)showExport(exportTS(doc),'TypeScript placement / WorldObject snippet','placements.ts')};
 el('play').onclick=()=>{if(doc&&!loading)showExport(teleportPayload(doc,selected),'DEBUG teleport payload — DEBUGのChapter / Map / X / Zへ手動入力','debug-teleport.json')};
 el('copy').onclick=async()=>{try{await navigator.clipboard.writeText(el<HTMLTextAreaElement>('output').value);status('Copied')}catch{el<HTMLTextAreaElement>('output').select();status('クリップボードへ書けません。選択済みテキストをCtrl+Cでコピーしてください。')}};
 el('download').onclick=()=>{const url=URL.createObjectURL(new Blob([el<HTMLTextAreaElement>('output').value],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=exportName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};el('close').onclick=()=>el<HTMLDialogElement>('export').close();
 const resize=new ResizeObserver(()=>{const w=view.clientWidth,h=view.clientHeight;if(w&&h){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}});resize.observe(view);
 function frame(){if(dead)return;raf=requestAnimationFrame(frame);orbit.update();selection?.update();if(active)renderer.render(active.scene,camera)}frame();
 for(const c of editorChapters())chapterSelect.add(new Option(c.title,c.id));await openMap(chapterSelect.value,0);
 const beforeUnload=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',beforeUnload);
 return ()=>{dead=true;version++;cancelAnimationFrame(raf);resize.disconnect();window.removeEventListener('beforeunload',beforeUnload);transform.dispose();orbit.dispose();active?.dispose();renderer.dispose();root.remove()};
}
