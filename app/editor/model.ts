export const DRAFT_KEY='lumenfall-editor-draft';
export type EditorObject={id:string;kind:string;name:string;x:number;z:number;radius?:number;source:'existing'|'draft';metadata?:{gameId?:string;sprite?:string;scale?:number;destination?:number;placementKind?:string}};
export type EditorDocument={version:1;chapterId:string;mapId:number;objects:EditorObject[]};
export function editorEnabled(dev:boolean,search:string){return dev&&new URLSearchParams(search).get('editor')==='1'}
export function validateDocument(value:unknown):EditorDocument{
 const d=value as EditorDocument;if(!d||d.version!==1||typeof d.chapterId!=='string'||!Number.isInteger(d.mapId)||!Array.isArray(d.objects)||d.objects.length>2000)throw Error('Invalid Editor draft');
 const ids=new Set<string>();const objects=d.objects.map(o=>{
  if(!o||typeof o.id!=='string'||!o.id||ids.has(o.id)||typeof o.name!=='string'||typeof o.kind!=='string'||![o.x,o.z].every(Number.isFinite)||Math.abs(o.x)>10000||Math.abs(o.z)>10000||!['existing','draft'].includes(o.source))throw Error('Invalid Editor object');
  if(o.radius!==undefined&&(!Number.isFinite(o.radius)||o.radius<0||o.radius>1000))throw Error('Invalid radius');ids.add(o.id);
  const clean:EditorObject={id:o.id,kind:o.kind,name:o.name,x:o.x,z:o.z,source:o.source};if(o.radius!==undefined)clean.radius=o.radius;
  if(o.metadata){clean.metadata={};for(const k of ['gameId','sprite','placementKind'] as const)if(typeof o.metadata[k]==='string')clean.metadata[k]=o.metadata[k];for(const k of ['scale','destination'] as const)if(Number.isFinite(o.metadata[k]))clean.metadata[k]=o.metadata[k]}
  return clean;
 });return {version:1,chapterId:d.chapterId,mapId:d.mapId,objects};
}
export function updateObject(d:EditorDocument,id:string,patch:Partial<Pick<EditorObject,'x'|'z'|'name'|'radius'>>){
 const o=d.objects.find(o=>o.id===id);if(!o)throw Error('Object not found');
 const candidate={...o,...patch};validateDocument({...d,objects:d.objects.map(x=>x===o?candidate:x)});Object.assign(o,patch);return o;
}
export function moveObject(d:EditorDocument,id:string,x:number,z:number,snap=0){const round=(v:number)=>snap>0?Math.round(v/snap)*snap:v;return updateObject(d,id,{x:round(x),z:round(z)})}
export function addDraft(d:EditorDocument,kind:string):EditorObject{
 if(!['npc','enemy','chest','prop'].includes(kind))throw Error('Unknown draft kind');let i=1;while(d.objects.some(o=>o.id===`draft-${kind}-${i}`))i++;
 const o:EditorObject={id:`draft-${kind}-${i}`,kind,name:`Draft ${kind}`,x:0,z:0,radius:2.3,source:'draft'};
 validateDocument({...d,objects:[...d.objects,o]});d.objects.push(o);return o;
}
export function deleteObject(d:EditorDocument,id:string,confirmed=false){const o=d.objects.find(o=>o.id===id);if(!o)throw Error('Object not found');if(o.source==='existing'&&!confirmed)throw Error('Existing placement needs confirmation');d.objects=d.objects.filter(o=>o.id!==id)}
export const exportJSON=(d:EditorDocument)=>JSON.stringify(validateDocument(d),null,2);
export function exportTS(d:EditorDocument){
 const data=validateDocument(d),start=data.objects.find(o=>o.kind==='player-start');
 const objects=data.objects.filter(o=>o.kind!=='player-start').map(o=>({id:o.metadata?.gameId??o.id,kind:o.metadata?.placementKind??o.kind,name:o.name,x:o.x,z:o.z,r:o.radius??2.3}));
 const metadata=data.objects.filter(o=>o.metadata||o.source==='draft').map(o=>({id:o.metadata?.gameId??o.id,...o.metadata,needsDefinition:o.source==='draft'}));
 return '// Review before pasting. Draft enemy/event/reward definitions are NOT generated.\n'+
  `export const playerStart = ${JSON.stringify(start?{area:data.mapId,x:start.x,z:start.z}:null,null,2)};\n`+
  `export const worldObjects = ${JSON.stringify(objects,null,2)};\n`+
  '// Preserve sprite/scale/destination when adapting to chapter-local Placement.\n'+`export const placementMetadata = ${JSON.stringify(metadata,null,2)};\n`;
}
export function saveDraft(storage:Pick<Storage,'setItem'>,d:EditorDocument){storage.setItem(DRAFT_KEY,exportJSON(d))}
export function loadDraft(storage:Pick<Storage,'getItem'>){const raw=storage.getItem(DRAFT_KEY);return raw?validateDocument(JSON.parse(raw)):null}
export function clearDraft(storage:Pick<Storage,'removeItem'>){storage.removeItem(DRAFT_KEY)}
export function teleportPayload(d:EditorDocument,id:string){const o=d.objects.find(o=>o.id===id);if(!o)throw Error('Select an object');return JSON.stringify({chapterId:d.chapterId,mapId:d.mapId,x:o.x,z:o.z},null,2)}
