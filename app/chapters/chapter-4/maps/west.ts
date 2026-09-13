import type {ChapterContext} from '../../types.ts';
import {foundation,palette,trees,beacon,lamp,finish} from './scenery.ts';
import {flags} from '../state.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);trees(c);beacon(c,0,-13,!!flags(c.state).west);const fallen=c.cyl(-11,.4,-8,.5,5,m.stone);fallen.rotation.z=1.3;for(const z of [12,1,-8])lamp(c,5,z);c.box(-11,.3,5,1.2,.6,1,m.gold);finish(c)}
