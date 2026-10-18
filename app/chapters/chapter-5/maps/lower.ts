import type {ChapterContext} from '../../types.ts';
import {foundation,furnace,house,pipe,lamp,finish} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c);furnace(c,m);for(const x of [-12,12])for(const z of [-11,0,9])house(c,m,x,z,4,4);for(const x of [-14,14])pipe(c,m,x,0,32);for(const z of [-12,0,12])lamp(c,m,2,z);
 c.box(-5,.8,7,3,.2,1,m.wood);c.box(-5,1.05,7,.8,.3,.5,m.metal);c.cyl(6,1,4,.2,.8,m.blue);c.box(6,.5,4,.6,.2,.6,m.wood);finish(c,m)}
