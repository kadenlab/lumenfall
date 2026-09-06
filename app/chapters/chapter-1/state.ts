import {mainQuest} from './quest-config.ts';
import {progress} from '../../systems/progression.ts';
import type {GameState} from '../../systems/state.ts';
/** Chapter 1's original numeric story stages are local to this content pack. */
const views=new WeakMap<GameState,ReturnType<typeof createView>>();
export function view(state:GameState){let result=views.get(state);if(!result){result=createView(state);views.set(state,result)}return result}
function createView(state:GameState){const p=progress(state.campaign);let sealWest:unknown,sealEast:unknown,seals:string[]=[];return new Proxy(state as GameState & {quest:number;seals:string[];springUsed:boolean;dungeonVersion:number;wins:string[];chests:string[]},{
 get(target,key){if(key==='quest')return Number(p.flags.storyStage??0);if(key==='seals'){const w=p.flags['seal:west'],e=p.flags['seal:east'];if(w!==sealWest||e!==sealEast){sealWest=w;sealEast=e;seals=[];if(w===true)seals.push('west');if(e===true)seals.push('east')}return seals;}if(key==='springUsed')return p.flags.springUsed===true;if(key==='dungeonVersion')return Number(p.flags.dungeonVersion??1);if(key==='wins')return p.defeatedEnemies;if(key==='chests')return p.chests;return Reflect.get(target,key)},
 set(target,key,value){if(key==='quest'){p.flags.storyStage=value;p.quests[mainQuest.id]=value===3?'completed':value>0?'active':'not-started';return true}if(key==='seals'){for(const id of ['west','east'])p.flags['seal:'+id]=value.includes(id);return true}if(key==='springUsed'||key==='dungeonVersion'){p.flags[key]=value;return true}return Reflect.set(target,key,value)}
})}
