import type {GameState} from '../../systems/state.ts';
export type Floor={x:number;z:number;w:number;d:number};
export const floors:Record<number,Floor[]>={
 0:[{x:0,z:0,w:10,d:39}],1:[{x:0,z:0,w:30,d:39}],
 2:[{x:0,z:0,w:18,d:39},{x:-11,z:4,w:8,d:13}],3:[{x:0,z:0,w:24,d:39}],
 4:[{x:0,z:0,w:29,d:39}],5:[{x:0,z:0,w:13,d:39},{x:9,z:-3,w:7,d:12}],
 6:[{x:0,z:0,w:27,d:39}],7:[{x:0,z:0,w:28,d:39}]
};
export function height(s:GameState,_x:number,z:number){return s.area>=4?Math.max(0,Math.min(2,(8-z)*.075)):s.area===3?Math.max(0,Math.min(1.2,(4-z)*.06)):0}
export function walkable(s:GameState,x:number,z:number){if(Math.abs(x)>19||Math.abs(z)>19)return false;return !!floors[s.area]?.some(r=>Math.abs(x-r.x)<r.w/2-.3&&Math.abs(z-r.z)<r.d/2-.3)&&!(s.area===7&&Math.hypot(x,z+10)<3.3)}
