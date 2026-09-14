import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {floors} from '../terrain.ts';
import {flags,bridgeOpen,naveOpen} from '../state.ts';
import {place,placements} from '../object-config.ts';
export function foundation(c:ChapterContext){
 const deep=c.state.area>=2;
 c.scene.background=new T.Color(deep?'#112c41':'#193a4d');c.scene.fog=new T.FogExp2(deep?'#355b70':'#426f80',deep?.023:.021);
 c.ambient.color.set('#c0e6fa');c.ambient.groundColor.set('#425c70');c.ambient.intensity=1.9;c.sun.color.set('#9cdffa');c.sun.intensity=2.7;c.sun.position.set(-16,24,-8);c.scene.userData.fillLift=1.16;
 c.box(0,-3,0,49,3,49,c.mat('#112631'));
 // One reflection surface per visited map, never a reflector per puddle.
 c.water(0,0,48,48,-.72);
 const stone=c.mat(deep?'#536875':'#516773',.24),edge=c.mat('#2e4758',.38),inlay=c.mat('#8eaab4',.3);
 for(const r of floors[c.state.area]){const rows=deep?Math.ceil(r.d):1;for(let i=0;i<rows;i++){const d=r.d/rows,z=r.z-r.d/2+(i+.5)*d,y=c.height(r.x,z);c.box(r.x,y-.42,z,r.w,.8,d+.015,edge);c.box(r.x,y-.015,z,r.w,.05,d+.015,stone)}}
 // Tiles share three materials and are merged by the existing spatial static batcher.
 for(let i=0;i<130;i++){const r=floors[c.state.area][i%floors[c.state.area].length],x=r.x+(c.rand(i+502)-.5)*(r.w-.8),z=r.z+(c.rand(i+952)-.5)*(r.d-.8);c.box(x,c.height(x,z)+.025,z,.8,.025,.45,i%4===0?inlay:stone,false)}
 if(c.state.area===1&&bridgeOpen(c.state)){c.box(0,-.16,-15,4.8,.28,12,stone);for(let z=-20;z<=-10;z+=2)for(const x of [-2.1,2.1])c.box(x,.025,z,.15,.04,1.1,new T.MeshStandardMaterial({color:'#8fe7ee',emissive:'#51b6d1',emissiveIntensity:1.1}),false)}
 if(c.state.area===2){for(let i=0;i<10;i++)c.box(0,i*.14,-8-i,8,.18,1.06,stone);if(!naveOpen(c.state))c.box(0,1.4,-11,8,2.6,.18,new T.MeshStandardMaterial({color:'#163d57',emissive:'#214967',transparent:true,opacity:.75}))}
 if(c.state.area===3)for(let i=0;i<12;i++)c.box(0,i*.16,-6-i,8,.18,1.08,stone);
}
export function lantern(c:ChapterContext,x:number,z:number,lit=true,color='#a7f3ff',scale=1){const y=c.height(x,z),iron=c.mat('#263f4c',.36);c.cyl(x,y+.7*scale,z,.08,1.4*scale,iron);c.box(x,y+1.45*scale,z,.48*scale,.72*scale,.48*scale,iron);const glow=new T.MeshStandardMaterial({color:lit?color:'#314657',emissive:color,emissiveIntensity:lit?2.1:0,roughness:.3});const glass=c.box(x,y+1.46*scale,z,.37*scale,.53*scale,.5*scale,glow,false);c.box(x,y+1.87*scale,z,.6*scale,.09,.6*scale,iron);if(lit)c.light(x,y+1.7*scale,z,color,7);return glass}
export function arch(c:ChapterContext,x:number,z:number,w=9,h=7){const m=c.mat('#68818d',.42);for(const dx of [-w/2,w/2]){c.cyl(x+dx,h/2,z,.48,h,m);c.box(x+dx,.3,z,1.4,.6,1.4,m);c.box(x+dx,h-.5,z,1.2,.25,1.2,m)}for(let i=0;i<9;i++){const a=i*Math.PI/8;const b=c.box(x+Math.cos(a)*w/2,h-.5+Math.sin(a)*2.5,z,1.25,.65,.8,m);b.rotation.z=a-Math.PI/2}}
export function building(c:ChapterContext,x:number,z:number,w:number,h:number){const stone=c.mat('#344f62',.38),roof=c.mat('#23394d',.5),trim=c.mat('#74949c',.3),win=new T.MeshStandardMaterial({color:'#ffd6a1',emissive:'#ffb563',emissiveIntensity:1.7});c.box(x,h/2,z,w,h,4.5,stone);c.box(x,h+.15,z,w+.7,.3,5.2,roof);for(const dx of [-w*.3,w*.3]){c.box(x+dx,h*.58,z+2.29,.75,1.2,.05,win,false);c.box(x+dx,h*.58,z+2.34,.055,1.3,.07,trim);c.light(x+dx,h*.58,z+2.5,'#ffd9a3',4)}c.box(x,.85,z+2.3,.85,1.7,.1,roof);c.blocks.push({x,z,w:w+.2,d:4.7})}
export function finishMap(c:ChapterContext){place(c);const f=flags(c.state);for(const p of placements[c.state.area]){if(p.kind!=='lamp'&&p.kind!=='beacon')continue;const i=['bell-beacon','boat-beacon','star-beacon'].indexOf(p.id);const lit=i>=0?Number(f.beacons??0)>i:!!f[p.id];const g=lantern(c,p.x,p.z,lit,lit?'#ffdfa1':'#b0dfff',1.25);if(p.id.startsWith('vigil')){g.userData.dynamic=true;(c.world.userData.vigil??=[]).push(g)}const ring=new T.Mesh(new T.TorusGeometry(.8,.035,6,24),new T.MeshStandardMaterial({color:'#80d6e3',emissive:'#3c9cb2',emissiveIntensity:.8}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,c.height(p.x,p.z)+.08,p.z);c.world.add(ring)}}
