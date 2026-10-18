import type {ChapterContext} from '../../types.ts';
import {foundation,furnace,lamp,pipe,finish} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c);furnace(c,m);c.box(0,4,-22,25,8,6,m.stone);c.box(0,8.3,-22,26,.6,7,m.metal);for(const x of [-10,-5,5,10]){c.cyl(x,3.7,-18.8,.5,7.4,m.stone);c.box(x,5.5,-18.4,.3,1.8,.15,m.warm)}c.box(0,2,-18.9,3.3,4,.3,m.dark);for(const x of [-12,12]){pipe(c,m,x,0,30);for(const z of [-11,0,11])lamp(c,m,x-1,z)}for(const x of [-6,0,6])c.box(x,.08,0,.06,.03,32,m.metal,false);finish(c,m)}
