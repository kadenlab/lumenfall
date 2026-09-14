import type {GameState} from '../../systems/state.ts';
import {canEnter} from './state.ts';
export const floors:Record<number,{x:number;z:number;w:number;d:number}[]>={
 0:[{x:0,z:0,w:38,d:40}],1:[{x:0,z:0,w:38,d:40}],
 2:[{x:0,z:0,w:10,d:40},{x:0,z:6,w:38,d:9},{x:-13,z:-4,w:8,d:25},{x:13,z:-4,w:8,d:25},{x:0,z:-12,w:34,d:7}],
 3:[{x:0,z:0,w:12,d:40},{x:0,z:7,w:34,d:8},{x:-13,z:0,w:7,d:21},{x:13,z:0,w:7,d:21},{x:0,z:-8,w:32,d:8}],
 4:[{x:0,z:13,w:10,d:14},{x:0,z:-3,w:30,d:26}]
};
export function height(s:GameState,_x:number,z:number){return s.area===2?Math.max(0,Math.min(1.8,(6-z)*.09)):s.area===3?Math.max(-1.6,Math.min(0,(z-8)*.07)):s.area===4?-1.6:0}
export function insideFurnace(x:number,z:number){return x*x+(z+11)**2<5.9**2}
export function walkable(s:GameState,x:number,z:number){return !(s.area===4&&insideFurnace(x,z))&&canEnter(s,s.area)&&!!floors[s.area]?.some(r=>Math.abs(x-r.x)<r.w/2-.2&&Math.abs(z-r.z)<r.d/2-.2)}
