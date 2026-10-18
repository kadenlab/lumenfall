import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {widths} from '../terrain.ts';
import {place,placements} from '../object-config.ts';
import {flags} from '../state.ts';
export function foundation(c:ChapterContext){const a=c.state.area,upper=a===2,underground=a>=3;
 c.scene.background=new T.Color(upper?'#59473f':underground?'#101d27':'#302b32');c.scene.fog=new T.FogExp2(underground?'#17232d':'#40363b',.012);
 c.ambient.intensity=2.4;c.ambient.color.set(underground?'#adc8dc':'#d9bec4');c.ambient.groundColor.set('#353441');c.sun.intensity=upper?3:1.8;c.sun.color.set(underground?'#a8cbdc':'#edbc8b');c.sun.position.set(-14,25,9);
 const glow=(color:string,intensity:number)=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.5});
 const m={stone:c.mat(upper?'#b4a791':underground?'#525d65':'#70605a'),dark:c.mat('#30343e'),ash:c.mat('#9b9292'),metal:c.mat(upper?'#ab8955':'#655a50'),wood:c.mat('#5d4942'),warm:glow(upper?'#ffd78b':'#d58a50',upper?1.5:.4),blue:glow('#a5d9e8',1.25),paper:c.mat('#ded2b7')};
 for(const material of [m.stone,m.dark,m.wood,m.metal,m.ash]){material.emissive.copy(material.color);material.emissiveIntensity=upper?.3:.22}
 c.box(0,-.35,0,widths[a],.7,38,m.dark);c.box(0,.015,0,widths[a]-.2,.08,38,m.stone);
 for(let z=-17;z<19;z+=3)c.box(0,.063,z,widths[a]-.5,.018,.035,m.dark,false);
 for(const x of [-widths[a]/2,widths[a]/2])c.box(x,.15,0,.2,.3,38,m.metal);
 if(a!==2)for(let i=0;i<18;i++){const x=(i%2?1:-1)*(widths[a]/2-1.3),z=-16+(i>>1)*4;c.box(x,.095,z,1.3,.1,1.6,m.ash,false)}
 if(a<3){const positions=new Float32Array(48*3);for(let i=0;i<48;i++){positions[i*3]=Math.sin(i*17)*widths[a]/2;positions[i*3+1]=(i%12)*.7;positions[i*3+2]=Math.cos(i*13)*18}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));const material=new T.PointsMaterial({color:'#b6a7a3',size:.07,transparent:true,opacity:.5,depthWrite:false});material.onBeforeCompile=shader=>{shader.uniforms.uAshTime=c.animationTime;shader.vertexShader='uniform float uAshTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y=mod(position.y-uAshTime*.35,9.0);transformed.x+=sin(uAshTime*.2+position.z)*.3;')};c.world.add(new T.Points(geometry,material))}
 return m;
}
export type Palette=ReturnType<typeof foundation>;
export function lamp(c:ChapterContext,m:Palette,x:number,z:number,blue=false){c.cyl(x,.9,z,.1,1.8,m.dark);c.box(x,1.9,z,.4,.6,.4,blue?m.blue:m.warm);c.box(x,2.25,z,.7,.1,.7,m.metal)}
export function pipe(c:ChapterContext,m:Palette,x:number,z:number,length:number){const p=c.cyl(x,.65,z,.24,length,m.metal);p.rotation.x=Math.PI/2;for(let k=-length/2;k<=length/2;k+=4){const collar=c.cyl(x,.65,z+k,.3,.15,m.dark);collar.rotation.x=Math.PI/2}}
export function house(c:ChapterContext,m:Palette,x:number,z:number,w=4,d=5){c.box(x,2,z,w,4,d,m.stone);c.box(x,4.15,z,w+.5,.3,d+.5,m.dark);c.box(x,1,z+d/2+.05,.9,2,.15,m.wood);for(const dx of [-1.2,1.2])c.box(x+dx,2.7,z+d/2+.08,.6,.8,.1,m.warm);c.blocks.push({x,z,w:w+.3,d:d+.3})}
export function furnace(c:ChapterContext,m:Palette){const first=c.world.children.length;c.cyl(0,8,-32,7,16,m.dark,12);c.cyl(0,15,-32,8,.8,m.metal,12);c.box(0,7,-24.9,5,7,.2,m.warm);for(const x of [-18,-11,11,18]){const h=17+Math.abs(x)/3;c.cyl(x,h/2,-30,.9,h,m.dark);c.cyl(x,h,-30,1.3,.5,m.metal)}for(const x of [-25,25])c.box(x,4,-32,12,8,8,m.dark);for(const o of c.world.children.slice(first))o.castShadow=false}
export function finish(c:ChapterContext,m:Palette){for(const p of placements[c.state.area]){if(['record','device'].includes(p.kind)){c.box(p.x,.5,p.z,1.1,1,1,m.dark);c.box(p.x,1.05,p.z,.9,.1,.8,p.kind==='device'?(['cooling','distribution','power'].indexOf(p.id)<Number(flags(c.state).puzzleStep||0)?m.blue:m.warm):m.paper)}if(p.kind==='spring'){c.box(p.x,.3,p.z,2,.6,1.3,m.wood);lamp(c,m,p.x-1,p.z)}if(p.kind==='shop')c.box(p.x,1,p.z-1,2.4,.3,1,m.wood)}place(c)}
export function flash(c:ChapterContext,m:Palette){if(c.sceneryOnly||flags(c.state).furnaceFlash||!c.progress.defeatedEnemies.includes('ash-eater'))return;
 // One shader pulse, no timer or dynamic light; safe on rebuild/dispose.
 const start=c.animationTime.value;m.warm.userData.dynamic=true;m.warm.onBeforeCompile=shader=>{shader.uniforms.uAshClock=c.animationTime;shader.uniforms.uAshStart={value:start};shader.fragmentShader='uniform float uAshClock; uniform float uAshStart;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance *= 1.0 + 14.0 * max(0.0, 1.0 - (uAshClock-uAshStart)/2.5);')};
 flags(c.state).furnaceFlash=true;c.save();c.talk('ミナ',['都市の灯が、ひと息だけ白く膨れた。遠くの炉から、石畳まで熱が走る。','……今の、明るすぎる。下の家の灯は、消えかけてるのに。','リオ「街へ行こう。あの光の下に、人がいる」']);
}
