import type {ChapterContext} from '../../types.ts';
import {foundation,lantern,arch,finishMap} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);const stone=c.mat('#435a6c',.4),wood=c.mat('#384955',.6);arch(c,0,15,10,6);arch(c,0,-13,10,8);
 for(const x of [-16,16]){c.box(x,2,-2,1,4,35,stone);for(let z=12;z>=-14;z-=6){c.box(x,4,z,1.6,2,1.6,stone);lantern(c,x*.84,z,true,'#aadff7')}}
 for(let z=8;z>=-6;z-=3)for(const x of [-4.5,4.5]){c.box(x,-.4,z,5,.3,1,wood);c.box(x,-.15,z-.4,5,.7,.15,wood)}
 c.cyl(0,2.8,-18,1.4,1.8,c.mat('#8b826a',.4),10);c.box(0,4.4,-18,.15,2.2,.15,stone);finishMap(c)}
