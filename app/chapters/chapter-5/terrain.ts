import type {GameState} from '../../systems/state.ts';
export const widths=[14,30,28,24,26];
export const height=()=>0;
export function walkable(s:GameState,x:number,z:number){return Number.isInteger(s.area)&&widths[s.area]!==undefined&&Math.abs(x)<widths[s.area]/2-.35&&Math.abs(z)<18.65}
