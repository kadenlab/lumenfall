import test from 'node:test';
import assert from 'node:assert/strict';
import {dungeonWalkable,shrines,gateOpen} from '../app/dungeon.ts';
function reachable(seals,target){const step=.5,q=[[0,36]],seen=new Set(['0,36']);for(let i=0;i<q.length;i++){const [x,z]=q[i];if(Math.hypot(x*step-target[0],z*step-target[1])<1)return true;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=nx+','+nz;if(!seen.has(k)&&dungeonWalkable(nx*step,nz*step,seals)){seen.add(k);q.push([nx,nz])}}}return false}
test('both side corridors and their guardians are reachable before unlocking',()=>{for(const a of shrines){assert.ok(reachable([],[a.x,a.z]));assert.ok(reachable([],[a.gx,a.gz]))}});
test('boss cannot be reached with zero or one seal, including by going around outer walls',()=>{for(const seals of [[],['west'],['east']])assert.equal(reachable(seals,[0,-16]),false)});
test('both seals open a route to the spring and boss',()=>{assert.ok(reachable(['west','east'],[2,-10.5]));assert.ok(reachable(['west','east'],[0,-16]))});
test('duplicate seal does not open the gate; completed saves remain traversable',()=>{assert.equal(gateOpen(['west','west'],1),false);assert.ok(gateOpen([],3));assert.equal(dungeonWalkable(18,0,[]),false)});
