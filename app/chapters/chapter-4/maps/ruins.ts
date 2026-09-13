import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {foundation,palette,pillar,ring,lamp,finish} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);const m=palette(c);for(const z of [9,0,-10])ring(c,0,c.height(0,z)+.14,z,6,m.gold);for(const x of [-13,13])for(const z of [-13,0,13])pillar(c,x,z,6);const signal=new T.MeshStandardMaterial({color:'#76d5d3',emissive:'#76d5d3',emissiveIntensity:1.2});c.world.userData.signal=signal;ring(c,0,4,-15,4,signal,true);for(const x of [-5,5])lamp(c,x,-7);c.box(-10,c.height(-10,-3)+.3,-3,1.2,.6,1,m.gold);finish(c)}
