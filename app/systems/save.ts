import {fresh} from './state.ts';
import type {GameState} from './state.ts';
import {migrateV1} from '../chapters/chapter-1/migrate.ts';
export const SAVE_VERSION=2, SAVE_KEY='lumenfall-save', LEGACY_KEY='lumenfall-v1';
export function encode(s:GameState){const {campaign,area,x,z,time,...player}=s;return {version:SAVE_VERSION,campaign,location:{area,x,z},player,playTime:time}}
function validObject(v:any){return v&&typeof v==='object'&&!Array.isArray(v)}
export function decode(raw:string):GameState{
 const d=JSON.parse(raw);if(d?.version> SAVE_VERSION)throw Error('この記録は新しいバージョンで作成されています');
 let s:GameState;
 if(d?.version===1)s=migrateV1(d);
 else if(d?.version===2){
 if(!validObject(d.campaign)||!validObject(d.player)||!validObject(d.location))throw Error('記録が破損しています');
 s={...fresh(),...d.player,...d.location,time:d.playTime,campaign:d.campaign};
 }else throw Error('対応していない記録です');
 const c=s.campaign;if(typeof c.currentChapter!=='string'||!Array.isArray(c.completedChapters)||!Array.isArray(c.unlockedChapters)||!validObject(c.chapters)||!c.chapters[c.currentChapter])throw Error('チャプター記録が破損しています');
 for(const p of Object.values(c.chapters)){if(!validObject(p)||!validObject(p.flags)||!validObject(p.quests)||!['bosses','defeatedEnemies','chests','unlockedAreas'].every(k=>Array.isArray((p as any)[k])))throw Error('進行記録が破損しています')}
 for(const key of ['area','x','z','hp','mp','lv','xp','gold','potions','ethers','time'] as const)if(!Number.isFinite(s[key]))throw Error('ステータスの記録が破損しています');
 s.lv=Math.max(1,Math.min(999,Math.floor(s.lv)));s.hp=Math.max(1,Math.min(100+(s.lv-1)*24,s.hp));s.mp=Math.max(0,Math.min(30+(s.lv-1)*8,s.mp));
 for(const k of ['xp','gold','potions','ethers'] as const)s[k]=Math.max(0,Math.floor(s[k]));s.x=Math.max(-21,Math.min(21,s.x));s.z=Math.max(-21,Math.min(21,s.z));s.sword=!!s.sword;s.armor=!!s.armor;return s;
}
export function readSave(storage:Pick<Storage,'getItem'>){const raw=storage.getItem(SAVE_KEY)??storage.getItem(LEGACY_KEY);if(!raw)throw Error('読み込める記録がありません');return decode(raw)}
export function writeSave(storage:Pick<Storage,'setItem'>,s:GameState){storage.setItem(SAVE_KEY,JSON.stringify(encode(s)))}
export function hasSave(storage:Pick<Storage,'getItem'>){return !!(storage.getItem(SAVE_KEY)||storage.getItem(LEGACY_KEY))}
