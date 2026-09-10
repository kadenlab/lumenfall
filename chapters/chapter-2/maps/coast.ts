import type {ChapterContext} from '../../types.ts';
import {foundation,lantern,arch,finishMap} from './scenery.ts';
import {bridgeOpen} from '../state.ts';
export function build(c:ChapterContext){foundation(c);const wood=c.mat('#394e57',.44),stone=c.mat('#405d6b',.4);for(let z=18;z>=-8;z-=3){for(const x of [-3.7,3.7])c.cyl(x,-.45,z,.18,2.2,wood)}for(let x=-15;x<=12;x+=3)c.box(x,.06,7,1.2,.08,4.6,wood);for(const [x,z]of [[-16,7],[-16,-4],[15,0],[15,-8],[-4,15]])lantern(c,x,z,true,'#91ddea');
 for(let i=0;i<8;i++){const x=i%2?20:-20,z=14-i*4;c.cyl(x,-.3,z,1.5+(i%3)*.4,2+(i%2),stone,5)}
 arch(c,0,-20,8,5);if(bridgeOpen(c.state))c.exitMarker(0,-19,'沈んだ橋 → 潮葬の礼拝堂');finishMap(c)}
