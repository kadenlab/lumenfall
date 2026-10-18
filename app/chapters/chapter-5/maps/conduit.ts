import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {foundation,pipe,lamp,finish} from './scenery.ts';
import {flags} from '../state.ts';
export function build(c:ChapterContext){const m=foundation(c);for(const x of [-13,13]){pipe(c,m,x,0,36);for(const z of [-12,0,12]){c.box(x,2.5,z,1,5,1,m.dark);lamp(c,m,x*.78,z,true)}}for(const x of [-2,2])c.box(x,.09,0,.2,.06,36,m.blue,false);
 for(const z of [-8,8]){const gear=new T.Mesh(new T.TorusGeometry(1.5,.23,6,12),m.metal);gear.position.set(-13,3,z);c.world.add(gear);for(let i=0;i<8;i++){const tooth=c.box(-13+Math.cos(i*Math.PI/4)*1.5,3+Math.sin(i*Math.PI/4)*1.5,z,.6,.6,.5,m.dark);tooth.rotation.z=i*Math.PI/4}}
 c.box(0,.13,-14,8,.2,4,m.metal);for(let x=-3;x<=3;x++)c.box(x,.25,-14,.05,.04,4,m.dark,false);
 if(!flags(c.state).passageRestored){c.box(0,1,-14,24,.3,.3,m.warm);c.blocks.push({x:0,z:-14,w:24,d:.4})}finish(c,m)}
