import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {flags} from '../state.ts';
import {foundation,pillar,lantern,finishMap} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c),warm=!!flags(c.state).rekindled;for(const x of [-16,16])for(const z of [5,-9])pillar(c,x,z,10);c.cyl(0,-.8,-11,5.5,1.4,m.stone,16);c.cyl(0,0,-11,4.6,.5,m.gold,16);
 const flame=new T.MeshStandardMaterial({color:warm?'#ffe7bc':'#a7e8ff',emissive:warm?'#ffb86b':'#83cfff',emissiveIntensity:warm?2.2:.6,roughness:.18});const core=new T.Mesh(new T.OctahedronGeometry(2.1,0),flame);core.position.set(0,3,-11);core.userData.dynamic=true;c.world.add(core);c.world.userData.hearths=[flame];c.light(0,4,-11,warm?'#ffcf98':'#aedfff',12);
 flame.onBeforeCompile=shader=>{shader.uniforms.uClock=c.animationTime;shader.fragmentShader='uniform float uClock;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance *= .85+.15*sin(uClock*3.);')};
 if(!warm){const black=new T.MeshStandardMaterial({color:'#192c43',metalness:.55,roughness:.23});for(let i=0;i<7;i++){const ice=new T.Mesh(new T.ConeGeometry(.7,3.8+i%3,5),black);ice.position.set(Math.cos(i)*3,1.9,-11+Math.sin(i)*3);ice.rotation.z=Math.cos(i)*.25;ice.userData.dynamic=true;c.world.add(ice);(c.world.userData.blackIce??=[]).push(ice)}}
 for(const z of [6,-2])for(const x of [-11,11]){const glow=lantern(c,x,z,true,warm);c.world.userData.hearths.push(glow)}lantern(c,3,11,true,true);finishMap(c)}
