import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {pixelRatio,AdaptiveQuality,batchStatic,waterProfile} from '../app/performance.ts';

test('4K and high-DPI screens stay inside the rendering pixel budget',()=>{
 for(const [w,h,dpr,mobile] of [[3840,2160,2,false],[1920,1080,1,false],[390,844,3,true]]){
  const r=pixelRatio(w,h,dpr,mobile);
  assert.ok(w*h*r*r<=(mobile?950000:1600000)+.1);assert.ok(r<=dpr);
 }
});
test('adaptive quality reacts to sustained load and does not oscillate',()=>{
 const q=new AdaptiveQuality();for(let i=0;i<2;i++)q.sample(45);assert.equal(q.scale,1);
 for(let i=0;i<80;i++)q.sample(25);assert.equal(q.scale,.65);
 for(let i=0;i<120;i++)q.sample(16.67);assert.equal(q.scale,1);
});
test('batching preserves triangle positions, bounds and dynamic meshes',()=>{
 const world=new T.Group(),material=new T.MeshStandardMaterial({color:'red'});
 for(let i=0;i<8;i++){const m=new T.Mesh(new T.BoxGeometry(1,2,3),material);m.position.set(i,0,1);m.rotation.y=i*.2;world.add(m)}
 const dynamic=new T.Mesh(new T.BoxGeometry(),material);dynamic.userData.dynamic=true;world.add(dynamic);
 const before=new T.Box3().setFromObject(world);const result=batchStatic(world),after=new T.Box3().setFromObject(world);
 assert.equal(result.before,8);assert.equal(result.after,1);assert.equal(world.children.length,2);assert.ok(world.children.includes(dynamic));
 assert.ok(before.min.distanceTo(after.min)<.00001);assert.ok(before.max.distanceTo(after.max)<.00001);
 assert.equal(world.children.find(x=>x!==dynamic).geometry.attributes.position.count,8*36);
});

test('fountain uses 16 vertices and no reflection; river retains detail',()=>{const small=waterProfile(2.4,2.4),river=waterProfile(3.3,47);assert.equal(small.reflect,false);assert.equal((small.segmentsX+1)*(small.segmentsY+1),16);assert.equal(river.reflect,true);assert.equal((river.segmentsX+1)*(river.segmentsY+1),429);assert.equal(pixelRatio(390,740,3,true),1.2);assert.equal(pixelRatio(390,740,3,false),1.25)});
