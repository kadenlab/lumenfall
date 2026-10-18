import type {Chapter} from '../types.ts';
import {progress,unlockArea} from '../../systems/progression.ts';
import {formallyCompleted} from '../../systems/chapter-access.ts';
import {maps} from './map-config.ts';
import {height,walkable} from './terrain.ts';
import {canEnter} from './state.ts';
import {begin,goal,interact,action} from './events.ts';
import {hud,modalUI} from './ui.ts';
import {enemies,damage,enemyAttack,status,enemyLabel} from './enemy-config.ts';
import {paintSprite} from './sprites.ts';
const chapter:Chapter={id:'chapter-5',title:'Chapter 5 — 灰に沈む灯',unlockNext:[],maps,enemies,paintSprite,combat:{damage,enemyAttack,status,enemyLabel},
 start:{area:0,x:0,z:16},returnTo:{area:1,x:0,z:16},respawn:{area:1,x:0,z:16},entry:area=>({...maps[area].spawn}),
 initialize(s){if(!formallyCompleted(s,'chapter-4'))throw Error('Chapter 4の正式クリアが必要です');progress(s.campaign).quests['furnace-flow']??='arrival';unlockArea(s.campaign,0)},
 normalize(s){if(!canEnter(s,s.area))s.area=0;if(!walkable(s,s.x,s.z))Object.assign(s,maps[s.area].spawn)},
 height,walkable,hasCompanion:()=>true,vegetation:()=>false,goal,begin,
 enter(c){unlockArea(c.state.campaign,c.state.area);c.save()},
 interact,action,hud,modalUI,endingUI:()=>'',objectVisibleInGuide:()=>true,
 onBossVictory:()=>{},onEnding:()=>{},onDefeat:()=>{},onRest:()=>{},
 music:{field:[130.81,164.81,196,146.83],night:[130.81,146.83,164.81,196],battle:[146.83,220,196,246.94]},effects:{phaseFog:'#30252b',phaseDensity:.02,phaseSun:'#edbc8b'}
};export default chapter;
