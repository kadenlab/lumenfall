import type {ChapterContext} from '../../types.ts';
import {foundation,palette,pillar,ring,beacon,finish} from './scenery.ts';
import {flags} from '../state.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);for(const x of [-10,10])for(const z of [-13,0,13])pillar(c,x,z,4);ring(c,0,2,-8,5,m.gold);ring(c,0,4,-13,4,m.edge,true);beacon(c,0,-13,!!flags(c.state).east);c.box(8,.35,6,1.3,.6,1,m.gold);finish(c)}
