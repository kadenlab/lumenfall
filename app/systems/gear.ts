import type {GameState} from './state.ts';
export const gear={
 'ring-sword':{name:'環潮の剣',slot:'weapon',bonus:11,description:'攻撃 +11'},
 'still-blade':{name:'静波の刃',slot:'weapon',bonus:10,description:'攻撃 +10／剣攻撃時20%で敵攻撃 −12%（2行動）'},
 'ring-cloak':{name:'環海の外套',slot:'armor',bonus:6,description:'被ダメージ −6'},
 'silent-cloth':{name:'無響の衣',slot:'armor',bonus:5,description:'被ダメージ −5／環海の妨害・MP吸収を半減'}
} as const;
export type GearId=keyof typeof gear;
export type GearState={owned:GearId[];weapon?:GearId;armor?:GearId};
export function awardGear(s:GameState,id:GearId){s.gear??={owned:[]};if(!s.gear.owned.includes(id))s.gear.owned.push(id);s.gear[gear[id].slot]=id}
export function equipGear(s:GameState,id:GearId){if(s.gear?.owned.includes(id)){s.gear[gear[id].slot]=id;return true}return false}
export const weaponBonus=(s:GameState)=>s.gear?.weapon?gear[s.gear.weapon]?.bonus??(s.sword?9:0):s.sword?9:0;
export const armorBonus=(s:GameState)=>s.gear?.armor?gear[s.gear.armor]?.bonus??(s.armor?5:0):s.armor?5:0;
export const resists=(s:GameState)=>s.gear?.armor==='silent-cloth';
export function gearUI(s:GameState,btn:(id:string,label:string,disabled?:boolean)=>string){return s.gear?.owned.length?`<div class=overlay><div class=panel><h2>武器・防具</h2>${s.gear.owned.map(id=>btn('gear:'+id,gear[id].name+' ／ '+gear[id].description,s.gear?.[gear[id].slot]===id)).join('')}${btn('close','戻る')}</div></div>`:''}
export function validateGear(s:GameState){if(!s.gear)return;const g=s.gear;if(!Array.isArray(g.owned)||g.owned.some(id=>!gear[id]))throw Error('装備の記録が破損しています');for(const slot of ['weapon','armor'] as const)if(g[slot]&&(!g.owned.includes(g[slot]!)||gear[g[slot]!].slot!==slot))throw Error('装備枠が正しくありません')}
