import type {GameState} from './state.ts';
export const gear={
 'afterwind-sword':{name:'残風の剣',slot:'weapon',bonus:12,description:'攻撃 +12／剣攻撃時20%で風守：次の被ダメージ −10%'},
 'tidelight-cloak':{name:'潮灯の外套',slot:'armor',bonus:6,description:'被ダメージ −6／MP吸収半減・勝利時MP +3'},
 'white-lamp-blade':{name:'白灯の刃',slot:'weapon',bonus:11,description:'攻撃 +11／HP30%以下の敵へのダメージ +12%（ボス +6%）'},
 'ringkeeper-robes':{name:'環海守の衣',slot:'armor',bonus:7,description:'被ダメージ −7／ボス戦の最初3行動、被ダメージ −8%'},
 'lamproad-sword':{name:'灯路の剣',slot:'weapon',bonus:13,description:'攻撃 +13／ボス戦5行動目以降の攻撃時、2行動ダメージ +10%（1戦1回）'},
 'ring-sword':{name:'環潮の剣',slot:'weapon',bonus:11,description:'攻撃 +11'},
 'still-blade':{name:'静波の刃',slot:'weapon',bonus:10,description:'攻撃 +10／剣攻撃時20%で敵攻撃 −12%（2行動）'},
 'ring-cloak':{name:'環海の外套',slot:'armor',bonus:6,description:'被ダメージ −6'},
 'silent-cloth':{name:'無響の衣',slot:'armor',bonus:5,description:'被ダメージ −5／環海の妨害・MP吸収を半減'}
} as const;
export type GearId=keyof typeof gear;
export type GearState={owned:GearId[];weapon?:GearId;armor?:GearId};
export function awardGear(s:GameState,id:GearId,autoEquip=true){s.gear??={owned:[]};if(!s.gear.owned.includes(id))s.gear.owned.push(id);if(autoEquip)s.gear[gear[id].slot]=id}
export function equipGear(s:GameState,id:GearId){if(s.gear?.owned.includes(id)){s.gear[gear[id].slot]=id;return true}return false}
export const weaponBonus=(s:GameState)=>s.gear?.weapon?gear[s.gear.weapon]?.bonus??(s.sword?9:0):s.sword?9:0;
export const armorBonus=(s:GameState)=>s.gear?.armor?gear[s.gear.armor]?.bonus??(s.armor?5:0):s.armor?5:0;
export const resists=(s:GameState)=>s.gear?.armor==='silent-cloth';
export function gearUI(s:GameState,btn:(id:string,label:string,disabled?:boolean)=>string){return s.gear?.owned.length?`<div class=overlay><div class=panel><h2>武器・防具</h2>${s.gear.owned.map(id=>btn('gear:'+id,gear[id].name+' ／ '+gear[id].description,s.gear?.[gear[id].slot]===id)).join('')}${btn('close','戻る')}</div></div>`:''}
export function validateGear(s:GameState){if(!s.gear)return;const g=s.gear;if(!Array.isArray(g.owned)||g.owned.some(id=>!gear[id]))throw Error('装備の記録が破損しています');for(const slot of ['weapon','armor'] as const)if(g[slot]&&(!g.owned.includes(g[slot]!)||gear[g[slot]!].slot!==slot))throw Error('装備枠が正しくありません')}
