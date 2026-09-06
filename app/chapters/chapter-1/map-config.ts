import type {MapConfig} from '../types.ts';
export const maps:MapConfig[]=[
 {id:0,name:'水灯の町 リュネ',eyebrow:'LYUNE · THE LANTERN VILLAGE',description:'夕映えの水路',night:false,spawn:{x:0,z:-17},load:()=>import('./maps/town.ts')},
 {id:1,name:'琥珀の丘',eyebrow:'AMBER HIGHLANDS',description:'風渡る旧街道',night:false,spawn:{x:0,z:18},load:()=>import('./maps/field.ts')},
 {id:2,name:'星眠りの遺跡',eyebrow:'MOONFALL SANCTUM',description:'森に眠る双灯の迷宮',night:true,spawn:{x:0,z:18},load:()=>import('./maps/dungeon.ts')},
];
export const areas=maps.map(m=>[m.name,m.eyebrow,m.description]);
