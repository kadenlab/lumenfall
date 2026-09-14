import type {Chapter} from '../types.ts';
import {progress,unlockArea,completeChapter} from '../../systems/progression.ts';
import {maps} from './map-config.ts';
import {flags,won} from './state.ts';
import {walkable,height} from './terrain.ts';
import {enemies,damage,enemyAttack,status,onCommand} from './enemy-config.ts';
import {paintSprite} from './sprites.ts';
import {goal,begin,interact,action} from './events.ts';
import {hud,modalUI,endingUI,visible} from './ui.ts';
import {dialogue} from './dialogue-config.ts';
const chapter:Chapter={id:'chapter-2',title:'Chapter 2 — 帰り灯の海',unlockNext:['chapter-3'],maps,enemies,paintSprite,
 start:{area:0,x:0,z:16},returnTo:{area:0,x:0,z:10},respawn:{area:0,x:0,z:16},
 initialize(s){const p=progress(s.campaign);if(p.flags.beacons===undefined)p.flags.beacons=0;if(!p.quests['missing-lights'])p.quests['missing-lights']='investigate';unlockArea(s.campaign,0)},
 normalize(s){if(!maps[s.area]||!walkable(s,s.x,s.z)){if(s.area===3&&!won(s,'bellwarden'))s.area=2;if(!maps[s.area])s.area=0;s.x=maps[s.area].spawn.x;s.z=maps[s.area].spawn.z}},
 height,walkable,hasCompanion:()=>true,vegetation:()=>false,goal,begin,interact,
 action(c,a){if(a==='harbor-notes'){c.modal='harbor-notes';c.renderUI();return true}return action(c,a)},hud,modalUI,endingUI,objectVisibleInGuide:visible,
 entry(area,from){return area===0?{x:0,z:-14}:area===1?{x:0,z:from===2?-17:17}:area===2?{x:0,z:from===3?-17:17}:{x:0,z:17}},
 enter(c){const key='entered-'+c.state.area;if(flags(c.state)[key])return;flags(c.state)[key]=true;const lines=c.state.area===1?dialogue.coast:c.state.area===2?dialogue.chapel:c.state.area===3?dialogue.choir:undefined;if(lines)c.talk('ミナ',lines)},
 onBossVictory(c,id){if(id==='bellwarden'){c.progress.quests['missing-lights']='choir';c.save();c.talk('沈鐘の衛士',dialogue.mid);return}if(id==='nereis'){c.progress.quests['missing-lights']='complete';flags(c.state).starGlass=true;completeChapter(c.state.campaign,['chapter-3']);c.save();c.talk('灯の戻る場所',dialogue.victory,()=>c.finish())}},
 onEnding(c){c.sun.color.set('#c1e8ef');c.sun.intensity=3.1},onDefeat(c){c.talk('宿の主人',['港の灯が、ふたりを導いた。HP・MPは回復した。灯火や討伐の進行は失われていないよ。'])},onRest(c){c.talk('宿の主人',['窓の灯を見ているうちに、深く眠っていた。HP・MPが全回復した。'])},
 music:{field:[196,246.94,293.66,369.99,293.66,246.94],night:[146.83,220,261.63,329.63,293.66,220,174.61,196],battle:[146.83,146.83,220,261.63,246.94,196,174.61,220]},
 effects:{phaseFog:'#263751',phaseDensity:.028,phaseSun:'#b8c9ff'},combat:{damage,enemyAttack,status,onCommand},
};export default chapter;
