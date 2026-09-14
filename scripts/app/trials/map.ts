import * as T from 'three';
import type {ChapterContext} from '../chapters/types.ts';
export function build(c:ChapterContext){c.scene.background=new T.Color('#050a15');c.scene.fog=new T.FogExp2('#141829',.033);c.ambient.color.set('#809bc3');c.ambient.intensity=1.35;c.sun.color.set('#a9d7fa');c.sun.intensity=2.3;
 const stone=c.mat('#414d65',.5),dark=c.mat('#202b41'),glow=new T.MeshStandardMaterial({color:'#b9ffef',emissive:'#69dfef',emissiveIntensity:2.4});
 c.world.userData.trialLamp=glow;
 c.cyl(0,-.7,0,12,1.4,stone,64);c.cyl(0,-1.5,0,12.8,.5,dark,64);
 for(const radius of [3.5,7,10.8]){const ring=new T.Mesh(new T.TorusGeometry(radius,.045,5,80),glow);ring.rotation.x=-Math.PI/2;ring.position.y=.05;c.world.add(ring)}
 for(let i=0;i<24;i++){const a=i*Math.PI/12,x=Math.sin(a)*9,z=Math.cos(a)*9;const glyph=c.box(x,.06,z,.09,.04,.55,glow,false);glyph.rotation.y=a;}
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=Math.sin(a)*11.8,z=Math.cos(a)*11.8,h=2+(i%3)*1.5;c.cyl(x,h/2,z,.6,h,stone,8);const cap=c.box(x,h+.2,z,1.5,.4,1.4,stone);cap.rotation.z=(i%2?.1:-.08);}
 c.cyl(0,.45,0,1.3,.9,dark,12);c.cyl(0,1,0,.7,.2,glow,12);const flame=new T.Mesh(new T.OctahedronGeometry(.65),glow);flame.position.set(0,1.9,0);c.world.add(flame);c.light(0,2.8,0,'#7feaf5',24);
 for(const x of [-7,7]){c.cyl(x,.65,-5,.55,1.3,stone);c.light(x,2,-5,'#9ab9ff',10);c.box(x,1.5,-5,.3,.4,.3,glow,false)}
 c.addObj('altar','灯の試練を選ぶ',0,2,'altar');for(const x of [-1.5,1.5]){c.cyl(x,.55,9,.18,1.1,stone);c.box(x,1.2,9,.25,.25,.25,glow,false)}c.addObj('exit','霧港へ帰る',0,9,'return');
}
