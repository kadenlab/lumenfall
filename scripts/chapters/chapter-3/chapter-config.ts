import type {Chapter} from '../types.ts';
import {progress,unlockArea} from '../../systems/progression.ts';
import {chapter2Cleared} from '../../trials/state.ts';
import {maps} from './map-config.ts';
import {flags,won,canEnter} from './state.ts';
import {walkable,height,insideFurnace} from './terrain.ts';
import {enemies,damage,enemyAttack,status,start,enemyLabel,onPhase} from './enemy-config.ts';
import {paintSprite} from './sprites.ts';
import {goal,begin,interact,action,ending} from './events.ts';
import {hud,modalUI,endingUI,visible} from './ui.ts';
import {dialogue} from './dialogue-config.ts';
const chapter:Chapter={id:'chapter-3',title:'Chapter 3 — 雪に閉ざされた灯',unlockNext:['chapter-4'],maps,enemies,paintSprite,
 start:{area:0,x:0,z:17},returnTo:{area:2,x:0,z:8},respawn:{area:0,x:0,z:17},
 initialize(s){if(!chapter2Cleared(s))throw Error('Chapter 2クリア後に解放されます');const p=progress(s.campaign);if(!p.quests['third-light'])p.quests['third-light']='snowfield';unlockArea(s.campaign,0)},
 normalize(s){if(!maps[s.area]||!canEnter(s,s.area))s.area=0;if(s.area===4&&insideFurnace(s.x,s.z)){s.x=0;s.z=-3.8}if(!walkable(s,s.x,s.z)){s.x=maps[s.area].spawn.x;s.z=maps[s.area].spawn.z}},
 height,walkable,hasCompanion:()=>true,vegetation:()=>false,goal,begin,interact,action,hud,modalUI,endingUI,objectVisibleInGuide:visible,
 entry(area,from){return {x:0,z:from>area?-16:17}},
 enter(c){const f=flags(c.state),key='entered-'+c.state.area;if(f[key])return;f[key]=true;if(won(c.state,'aurel'))return;const lines=c.state.area===1?dialogue.village:c.state.area===2?dialogue.city:c.state.area===3?dialogue.cathedral:c.state.area===4?dialogue.furnace:undefined;if(lines)c.talk('ミナ',lines)},
 onBossVictory(c,id){c.save();if(id==='warden'){c.progress.quests['third-light']='old-city';c.save();c.talk('凍れる番人',dialogue.warden)}else if(id==='aurel')ending(c)},
 onEnding(c){c.sun.color.set('#ffe3b4');c.sun.intensity=3.1},onDefeat(c){c.talk('ミナ',['道標の灯が、ふたりを雪原へ導いた。HP・MPは回復した。聞いた話も、開けた宝箱も失われていない。'])},onRest(c){c.talk('暖炉',['小さな火が、旅を続ける力をくれた。'])},
 music:{field:[164.81,220,246.94,329.63,293.66,220],night:[164.81,246.94,293.66,329.63,246.94,196],battle:[146.83,220,174.61,261.63,220,196],phase:[146.83,293.66,220,349.23,329.63,261.63,220,174.61]},effects:{phaseFog:'#203047',phaseDensity:.037,phaseSun:'#bde8ff'},combat:{start,damage,enemyAttack,status,enemyLabel,onPhase},
};export default chapter;
