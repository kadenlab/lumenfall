import type {Chapter} from '../types.ts';
import {progress,unlockArea} from '../../systems/progression.ts';
import {formallyCompleted} from '../../systems/chapter-access.ts';
import {maps} from './map-config.ts';
import {flags,canEnter} from './state.ts';
import {height,walkable} from './terrain.ts';
import {enemies} from './enemy-config.ts';
import * as combat from './combat.ts';
import {paintSprite} from './sprites.ts';
import {goal,begin,interact,action,ending} from './events.ts';
import {hud,modalUI,endingUI,visible} from './ui.ts';
const chapter:Chapter={id:'chapter-4',title:'Chapter 4 — 無音の環海',unlockNext:[],maps,enemies,paintSprite,
 start:{area:0,x:0,z:17},returnTo:{area:1,x:0,z:10},respawn:{area:1,x:0,z:15},entry:()=>({x:0,z:16}),
 initialize(s){if(!formallyCompleted(s,'chapter-3'))throw Error('Chapter 3クリア後に解放されます');progress(s.campaign).quests['ring-current']??='entrance';unlockArea(s.campaign,0)},
 normalize(s){if(!canEnter(s,s.area))s.area=0;if(!walkable(s,s.x,s.z)){s.x=maps[s.area].spawn.x;s.z=maps[s.area].spawn.z}},
 height,walkable,hasCompanion:()=>true,vegetation:()=>false,goal,begin,interact,action,hud,modalUI,endingUI,objectVisibleInGuide:visible,
 enter(c){const f=flags(c.state),key='entered-'+c.state.area;if(!f[key]){f[key]=true;c.save();if(c.state.area===1)c.talk('ミナ',['港にはまだ人がいる。ラウに、途切れた灯路のことを聞こう。'])}},
 onBossVictory(c,id){c.save();if(id==='seawarden'){c.progress.quests['ring-current']='corridor';c.save();c.talk('海守の沈黙',['石の海獣が静かに膝を折った。制御室から、沈灯回廊へ続く道が開く。'])}if(id==='ignas')ending(c)},
 onEnding(c){c.sun.color.set('#ffe6b6');c.sun.intensity=3},onDefeat(c){c.talk('港守 ラウ',['灯の流れがお前たちを港へ戻した。HP・MPは回復した。進行も宝箱も失っていない。もう一度、海へ。'])},onRest(c){c.talk('分かち火',['灯のそばで休んだ。'])},
 music:{field:[130.81,196,220,164.81,146.83,196],night:[130.81,196,146.83,164.81,130.81,220],battle:[146.83,220,196,293.66,164.81,246.94],phase:[196,293.66,392,329.63,440,293.66,261.63,392]},effects:{phaseFog:'#10363d',phaseDensity:.02,phaseSun:'#d3ffee'},combat,
};export default chapter;
