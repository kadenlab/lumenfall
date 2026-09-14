import type {ChapterContext} from '../../types.ts';
import {foundation,palette,pillar,ring,lamp,finish} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);for(const r of [3,6,10])ring(c,0,c.height(0,-5)+.1,-5,r,r===6?m.glow:m.gold);for(const x of [-12,12])for(const z of [-12,2,13])pillar(c,x,z,7);ring(c,0,7,-19,7,m.edge,true);lamp(c,-5,-2,true);lamp(c,5,-2);finish(c)}
