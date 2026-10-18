import type {ChapterContext} from '../../types.ts';
import {foundation,furnace,lamp,finish,flash} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c);furnace(c,m);for(const x of [-17,-12]){const stack=c.cyl(x,6,-7,.8,12,m.dark);stack.castShadow=false;c.box(x,12,-7,2,.3,2,m.metal).castShadow=false}for(const z of [-12,0,12])lamp(c,m,6,z);
 c.box(-4,.6,4,2.5,.5,3,m.wood);c.box(-4,.95,4.6,2.7,.25,1.8,m.ash);for(const z of [3,5]){const wheel=c.cyl(-5.3,.5,z,.55,.2,m.dark);wheel.rotation.z=Math.PI/2}const shaft=c.box(-4,.5,7,.15,.15,3,m.wood);shaft.rotation.y=.3;c.blocks.push({x:-4,z:4,w:3,d:3});finish(c,m);flash(c,m)}
