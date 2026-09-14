import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {flags} from '../state.ts';
import {foundation,house,lantern,arch,finishMap} from './scenery.ts';
export function build(c:ChapterContext){const m=foundation(c),f=flags(c.state);for(const side of [-1,1]){for(let i=0;i<3;i++)house(c,side*(18+i%2*3),10-i*11,5.8,5+i*1.4,Number(f.cityLights??0)>i);c.box(side*7.5,-.5,-1,3,.18,28,m.ice)}for(let i=0;i<12;i++)c.box(0,i*.15,5-i*1.5,8,.2,1.55,m.stone);arch(c,-15,10,8);
 c.cyl(0,9,-23,4,18,m.stone,10);for(let i=0;i<3;i++){const ring=new T.Mesh(new T.TorusGeometry(4.15,.18,6,24),m.ice);ring.rotation.x=Math.PI/2;ring.position.set(0,5+i*5,-23);c.world.add(ring)}const dome=new T.Mesh(new T.SphereGeometry(4.5,12,6,0,Math.PI*2,0,Math.PI/2),m.dark);dome.position.set(0,18,-23);c.world.add(dome);for(let i=0;i<3;i++)for(const side of [-1,1])lantern(c,side*4,12-i*9,Number(f.cityLights??0)>i,true);
 c.box(-13,c.height(-13,-9)+.7,-9,2,1.4,1.3,m.dark);for(let i=0;i<3;i++)c.box(-13.7+i*.7,c.height(-13,-9)+1.43,-9,.35,.08,.5,m.gold);
 if(f.worldMap){
  const plate=c.cyl(0,.35,7,2.6,.25,m.dark,12);plate.userData.dynamic=true;
  const points=[];
  for(let i=0;i<4;i++){
   const color=i===3&&f.endingComplete?'#20152c':'#ffe3a3';
   const glow=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:i===3&&f.endingComplete?.1:2});
   const mark=c.cyl(-1.8+i*1.2,.6,7+Math.sin(i)*.8,.18,.2,glow,8);mark.userData.dynamic=true;
   if(i<3)points.push(mark.position.clone());
   if(i===3&&!f.endingComplete){const start={value:c.animationTime.value};glow.onBeforeCompile=shader=>{shader.uniforms.uClock=c.animationTime;shader.uniforms.uStart=start;shader.fragmentShader='uniform float uClock; uniform float uStart;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat darkening=smoothstep(2.,8.,uClock-uStart);totalEmissiveRadiance*=1.-darkening;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.06,.035,.09),darkening);')};}
  }
  const line=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:'#ffe3a3',transparent:true,opacity:.65}));c.world.add(line);
 }
 finishMap(c)
}
