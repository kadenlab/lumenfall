import type {ChapterContext} from '../../types.ts';
import {foundation,palette,house,lamp,ring,finish} from './scenery.ts';
import {linked,flags} from '../state.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);house(c,-10,4);house(c,10,-2);house(c,-8,-7);for(const x of [-17,17]){c.box(x,-.1,8,3,.25,14,m.wood);for(const z of [3,8,13])c.cyl(x+.8,-.1,z,.12,1.3,m.wood);c.box(x+3,-.3,5,2,.6,5,m.dark);c.cyl(x+3,1.8,5,.06,4,m.wood)}for(const x of [-5,5])lamp(c,x,-10,true);ring(c,0,.12,-6,3,m.gold);if(linked(c.state))for(let i=0;i<6;i++)c.box(0,-.5,-21-i*3,.14,.05,2,m.glow,false);if(flags(c.state).restored)c.light(0,5,-6,'#ffe4ac',10);finish(c)}
