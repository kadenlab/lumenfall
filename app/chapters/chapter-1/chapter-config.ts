import * as T from 'three';
import {dialogues} from './dialogue-config.ts';
import {paintSprite} from './sprites.ts';
import type {Chapter} from '../types.ts';
import {progress,unlockArea,completeChapter} from '../../systems/progression.ts';
import {view} from './state.ts';
import {maps} from './map-config.ts';
import {enemies} from './enemy-config.ts';
import {music,effects} from './audio-effects.ts';
import {gateOpen,dungeonWalkable} from './dungeon.ts';
import {goal,begin,interact,action} from './events.ts';
import {hud,modalUI,endingUI} from './ui.ts';
const chapter:Chapter={
 paintSprite,id:'chapter-1',title:'Chapter 1 — 灯の継承者',unlockNext:['chapter-2'],maps,enemies,music,effects,
 start:{area:0,x:0,z:8},returnTo:{area:0,x:0,z:8},respawn:{area:0,x:-10,z:5},
 initialize(state){const s=view(state);const p=progress(state.campaign);if(p.flags.storyStage===undefined)s.quest=0;unlockArea(state.campaign,0)},
 normalize(state){const s=view(state);if(!maps.some(m=>m.id===s.area)){s.area=0;s.x=0;s.z=8}if(s.area===2&&!dungeonWalkable(s.x,s.z,s.seals,s.quest)){s.x=0;s.z=18}},
 height(s,x,z){if(s.area===1&&x>5)return Math.min(2.3,(x-5)*.2);if(s.area===2&&z< -7)return Math.min(1.5,(-z-7)*.22);return 0},
 walkable(state,x,z){const s=view(state);return s.area!==2||dungeonWalkable(x,z,s.seals,s.quest)},
 hasCompanion(s){return view(s).quest>0},goal,begin,interact,action,hud,modalUI,endingUI,
 entry(area,from){return area===1?{x:0,z:from===2?-18:18}:maps.find(m=>m.id===area)!.spawn},
 enter(ctx){if(ctx.state.area===2&&view(ctx.state).quest<3)ctx.talk('ミナ',dialogues.dungeonEntry)},
 objectVisibleInGuide(ctx,o){const s=view(ctx.state);return o.kind!=='spring'||gateOpen(s.seals,s.quest)},
 onBossVictory(ctx,id){if(id!=='boss')return;view(ctx.state).quest=3;completeChapter(ctx.state.campaign,['chapter-2']);ctx.save();ctx.talk('ミナ',dialogues.bossCleared,()=>ctx.finish())},
 onEnding(ctx){ctx.sun.color.set('#ffe8bc');ctx.sun.intensity=4;ctx.scene.fog=new T.FogExp2('#c5c6b0',.018)},
 onDefeat(ctx){ctx.talk('宿の主人',dialogues.defeat)},
 onRest(ctx){ctx.talk('宿の主人',dialogues.innRest)},
 vegetation(s,x,z){return !(s.area===2&&Math.abs(x)<16&&Math.abs(z)<20||Math.abs(x)<3||s.area===0&&Math.abs(x)<15&&z<15||Math.abs(x-(s.area===0?-6:s.area===1?-11:9))<3)},
};
export default chapter;
