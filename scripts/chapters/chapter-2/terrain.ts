import type {GameState} from '../../systems/state.ts';
import {bridgeOpen,naveOpen,won} from './state.ts';
export type Rect={x:number;z:number;w:number;d:number};
// These same islands form both the visible floor and the collision surface.
export const floors:Record<number,Rect[]>={
 0:[{x:0,z:5,w:39,d:29},{x:0,z:-12,w:7,d:13}],
 1:[{x:0,z:12,w:8,d:16},{x:-9,z:7,w:18,d:5},{x:-13,z:1,w:7,d:13},{x:2,z:0,w:26,d:5},{x:12,z:-4,w:7,d:13},{x:0,z:-9,w:25,d:5}],
 2:[{x:0,z:14,w:9,d:13},{x:0,z:5,w:28,d:7},{x:-11,z:-2,w:6,d:20},{x:11,z:-2,w:6,d:20},{x:0,z:-9,w:26,d:6},{x:0,z:-16,w:10,d:10}],
 3:[{x:0,z:14,w:8,d:13},{x:0,z:6,w:30,d:7},{x:-12,z:0,w:6,d:12},{x:12,z:0,w:6,d:12},{x:0,z:-5,w:30,d:6},{x:0,z:-13,w:17,d:14}],
};
export function inside(r:Rect,x:number,z:number,margin=.18){return Math.abs(x-r.x)<r.w/2-margin&&Math.abs(z-r.z)<r.d/2-margin}
export function height(s:GameState,x:number,z:number){if(s.area===2&&z< -7)return Math.min(1.4,(-z-7)*.14);if(s.area===3&&z< -5)return Math.min(1.8,(-z-5)*.16);return 0}
export function walkable(s:GameState,x:number,z:number){
 if(Math.abs(x)>20.8||Math.abs(z)>20.8)return false;
 if(s.area===1&&bridgeOpen(s)&&inside({x:0,z:-15,w:5,d:12},x,z))return true;
 if(!floors[s.area]?.some(r=>inside(r,x,z)))return false;
 if(s.area===2&&z< -11&&!naveOpen(s))return false;
 if(s.area===3&&!won(s,'bellwarden'))return false;
 return true;
}
