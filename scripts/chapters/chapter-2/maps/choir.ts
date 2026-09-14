import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {foundation,lantern,arch,finishMap} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);arch(c,0,-13,18,9);arch(c,0,-19,21,10);const stone=c.mat('#344960',.32);for(const x of [-18,18])for(let z=10;z>=-18;z-=7){c.cyl(x,2.5,z,.75,7,stone);c.cyl(x,6,z,1.1,.3,stone)}
 const ring=new T.Mesh(new T.TorusGeometry(5,.16,8,48),new T.MeshStandardMaterial({color:'#a5dbf2',emissive:'#4b9dbf',emissiveIntensity:1.4}));ring.position.set(0,6,-19);c.world.add(ring);for(let i=0;i<8;i++){const a=i*Math.PI/4;const g=c.box(Math.cos(a)*5,6+Math.sin(a)*5,-19,.4,.65,.25,c.mat('#9bb9c8',.2));g.rotation.z=a}
 for(const x of [-3,3])lantern(c,x,12,true,'#ffd69b');c.cyl(0,.12,10,1.4,.25,c.mat('#83c3cc',.2),12);c.light(0,2,10,'#baffdb',9);finishMap(c)}
