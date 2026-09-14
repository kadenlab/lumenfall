import type {Chapter} from '../chapters/types.ts';
import {cases,INVESTIGATIONS} from './catalog.ts';
import {investigationUnlocked,migrateInvestigations} from './state.ts';
import {maps,height,walkable} from './maps.ts';
import {paintSprite} from './sprites.ts';
import {investigationMenu} from './ui.ts';
import {open,goal,interact,action,victory} from './events.ts';
import * as combat from './combat.ts';
const pack:Chapter={id:INVESTIGATIONS,title:'灯路異変調査',unlockNext:[],maps,
 enemies:Object.fromEntries(cases.map(c=>[c.enemy,{hp:c.hp,attack:c.attack,xp:0,gold:0,victoryText:'異変を鎮めた。調査報酬を受け取ります。',boss:true,scriptedBattle:true,eyebrow:'灯路異変 · '+c.title,intro:c.hint,phaseText:'残された流れがあふれる。予告を見て次の行動を選ぼう。'}])),
 start:{area:0,x:0,z:17},returnTo:{area:0,x:0,z:17},respawn:{area:0,x:0,z:17},
 initialize(s){if(!investigationUnlocked(s))throw Error('Chapter 4クリア後に解放されます');migrateInvestigations(s)},
 normalize(s){if(!maps.some(m=>m.id===s.area)){s.area=0;s.x=0;s.z=17}},entry:()=>({x:0,z:17}),height,walkable,vegetation:()=>false,hasCompanion:()=>true,paintSprite,
 begin:open,enter:()=>{},goal,interact,action,objectVisibleInGuide:()=>true,
 hud:c=>`<div class=top><div class=region><small>LAMP ROAD INVESTIGATION</small><h2>${cases[c.state.area].place}</h2><p>${cases[c.state.area].title}</p></div><div class=tools>${c.btn('map','⌖ 周辺')}${c.btn('menu','☰ メニュー')}</div></div><div class=quest>${c.btn('investigations','灯路異変調査 一覧')}${c.btn('guide','次の灯へ案内')}<p>痕跡 ${c.state.investigations?.run?.clues.length??0}/3 · ${c.state.investigations?.run?.resolved?'解消済み':'灯を調べ、流れを鎮める'}</p></div>`,
 modalUI:c=>c.modal==='investigations'?investigationMenu(c.state,c.btn):'',endingUI:()=>'',onBossVictory:victory,onEnding:()=>{},
 onDefeat(c){c.save();c.talk('ミナ',['灯の入口まで戻れた。痕跡の記録は残っている。準備して再挑戦しよう。'],()=>{c.modal='investigations';c.renderUI()})},onRest:()=>{},
 music:{field:[196,220,293.66,246.94],night:[146.83,196,220,293.66],battle:[146.83,220,261.63,196]},effects:{phaseFog:'#28424a',phaseDensity:.025,phaseSun:'#bbe7e4'},combat
};export default pack;
