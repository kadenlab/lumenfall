import type {GameState} from '../systems/state.ts';
import {cases} from './catalog.ts';
import {startCase,migrateInvestigations} from './state.ts';
import {claim} from './rewards.ts';
export const names=['Start','Before Boss','Cleared','Investigation Start','Anomaly 1','Anomaly 2','Anomaly 3','Anomaly 4','All Cleared'];
export const mapGates:Record<number,string>={};
export function apply(s:GameState,name:string){
 if(name==='Start'||name==='Investigation Start'){delete s.investigations;migrateInvestigations(s);return 0}
 if(name==='Cleared'||name==='All Cleared'){for(const c of cases){startCase(s,c.id).clues=[0,1,2];claim(s,c.id)}return 3}
 const id=name==='Before Boss'?0:Number(name.split(' ')[1])-1;startCase(s,id).clues=[0,1,2];return id;
}
export function prepareTravel(s:GameState,area:number){if(s.investigations?.run?.caseId!==area)startCase(s,area).clues=[0,1,2]}
export async function placements(){return {placements:Object.fromEntries(cases.map(c=>[c.id,[{id:c.enemy,name:c.name,kind:'boss',x:0,z:-14}]]))}}
