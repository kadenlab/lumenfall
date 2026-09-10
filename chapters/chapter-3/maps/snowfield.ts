import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {foundation,lantern,pillar,pine,finishMap} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c);for(let i=0;i<7;i++){const peak=new T.Mesh(new T.ConeGeometry(6+i%3,13+i%3*4,5),i%2?m.snow:m.ice);peak.position.set(-27+i*9,4,-28-i%2*6);peak.castShadow=true;c.world.add(peak)}for(const [x,z]of [[-14,13],[13,9],[-15,-1],[15,-13],[-11,-16]])pine(c,x,z,1.1);for(const [x,z,h]of [[-8,8,2],[9,-2,3],[-10,-12,1.5]])pillar(c,x,z,h);for(const z of [13,5,-4,-13])lantern(c,4+Math.sin(z)*.6,z,true,false);c.box(-9,.5,12,2,1,1,m.stone);c.box(-9,1.4,12,.7,1.3,.7,m.ice);finishMap(c)}
