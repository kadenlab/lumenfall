import type {GameState} from '../systems/state.ts';
import {awardGear} from '../systems/gear.ts';
import {maxHealth} from '../trials/state.ts';
import {caseById,cases,FIRST_XP,REPEAT_XP} from './catalog.ts';
import {migrateInvestigations,investigationUnlocked,ready} from './state.ts';
export function claim(s:GameState,id:number){
 if(!investigationUnlocked(s))throw Error('調査は未解放です');const c=caseById(id),n=migrateInvestigations(s);if(n.run?.caseId!==id||!ready(s))return null;
 const first=!n.cleared.includes(id),xp=n.xpRewarded.includes(id)?REPEAT_XP:FIRST_XP,gold=n.goldRewarded.includes(id)?c.repeatGold:c.gold;
 const item=!n.rewarded.includes(id)?c.item:null;
 if(first)n.cleared.push(id);if(item){awardGear(s,item,false);n.rewarded.push(id)}
 if(!n.xpRewarded.includes(id))n.xpRewarded.push(id);if(!n.goldRewarded.includes(id))n.goldRewarded.push(id);
 s.xp+=xp;s.gold+=gold;const before=s.lv;while(s.xp>=s.lv*30){s.xp-=s.lv*30;s.lv++}if(s.lv!==before){s.hp=maxHealth(s);s.mp=30+(s.lv-1)*8}
 const complete=cases.every(c=>n.cleared.includes(c.id))&&!n.allRewarded;if(complete){awardGear(s,'lamproad-sword',false);n.allRewarded=true}
 n.run!.resolved=true;return {first,xp,gold,item,complete,leveled:s.lv!==before};
}
