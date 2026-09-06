import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function pixelRatio(width:number,height:number,dpr:number,mobile:boolean,scale=1){
 const pixels=(mobile?950_000:1_600_000)*scale*scale;
 return Math.min(dpr,mobile?1.2:1.25,Math.sqrt(pixels/Math.max(1,width*height)));
}

// Sustained samples, hysteresis and cooldown avoid oscillation during spells/loading.
export class AdaptiveQuality {
 scale=1; slow=0; fast=0; cooldown=3;
 sample(ms:number){
  if(this.cooldown>0){this.cooldown--;return false}
  this.slow=ms>19.5?this.slow+1:0;this.fast=ms<17.4?this.fast+1:0;
  let next=this.scale;
  if(this.slow>=3)next=Math.max(.65,this.scale-.1);
  else if(this.fast>=12)next=Math.min(1,this.scale+.05);
  if(next===this.scale)return false;
  this.scale=next;this.slow=this.fast=0;this.cooldown=5;return true;
 }
}

// Preserve world-space geometry and collision data; group only opaque static meshes.
export function batchStatic(world:T.Group){
 world.updateMatrixWorld(true);
 const groups=new Map<string,T.Mesh[]>();let before=0;
 for(const child of [...world.children]){
  if(!(child instanceof T.Mesh)||child.userData.dynamic||!child.visible||Array.isArray(child.material)||!(child.material instanceof T.MeshStandardMaterial)||child.material.transparent)continue;
  before++;
  const m=child.material;
  const key=[m.color.getHex(),m.emissive.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.side,m.userData.kind??'',child.castShadow,child.receiveShadow,Math.floor(child.position.x/12),Math.floor(child.position.z/12)].join('|');
  const group=groups.get(key)??[];group.push(child);groups.set(key,group);
 }
 for(const meshes of groups.values()){
  if(meshes.length<2){meshes[0].matrixAutoUpdate=false;continue}
  const geometries=meshes.map(mesh=>{const g=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();g.applyMatrix4(mesh.matrix);return g});
  const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
  if(!merged)continue;
  const first=meshes[0],batch=new T.Mesh(merged,first.material);batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;batch.matrixAutoUpdate=false;
  merged.computeBoundingSphere();world.add(batch);
  for(const mesh of meshes)world.remove(mesh);
  // Original geometry/materials are released by the world's resource owner.
 }
 return {before,after:groups.size};
}

// Small pools keep lighting/waves but do not render the whole scene a second time.
export function waterProfile(width:number,depth:number){const reflect=Math.max(width,depth)>=12;return {reflect,segmentsX:reflect?12:Math.max(1,Math.ceil(width)),segmentsY:reflect?32:Math.max(1,Math.ceil(depth))}}
