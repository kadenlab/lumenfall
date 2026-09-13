import type {ChapterContext} from '../../types.ts';
import {foundation,palette,pillar,lamp,ring,finish} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);for(const z of [-12,0,12]){lamp(c,-4,z,true);lamp(c,4,z)}pillar(c,-8,-8,7);pillar(c,8,-8,5);ring(c,0,8,-22,9,m.edge,true);for(let i=0;i<5;i++)c.box(-12+i*5,-.5,-25,3,.04,.12,m.glow,false);finish(c)}
