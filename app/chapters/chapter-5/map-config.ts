import type {MapConfig} from '../types.ts';
export const maps:MapConfig[]=[
 {id:0,name:'灰降りの街道',eyebrow:'ASHEN ROAD',description:'流れの先に、眠らない大炉',night:true,spawn:{x:0,z:16},load:()=>import('./maps/road.ts')},
 {id:1,name:'グランヴェル下層区',eyebrow:'THE LOWER CITY',description:'細い灯が、暮らしをつなぐ',night:true,spawn:{x:0,z:16},load:()=>import('./maps/lower.ts')},
 {id:2,name:'上層区・炉政庁',eyebrow:'THE FURNACE OFFICE',description:'黄金の灯、その代価',night:false,spawn:{x:0,z:16},load:()=>import('./maps/office.ts')},
 {id:3,name:'地下送灯路',eyebrow:'THE LIGHT CONDUIT',description:'冷却、分配、そして通電',night:true,spawn:{x:0,z:16},load:()=>import('./maps/conduit.ts')},
 {id:4,name:'廃灰坑道',eyebrow:'THE ABANDONED ASH MINE',description:'灰の下で消えなかった灯',night:true,spawn:{x:0,z:16},load:()=>import('./maps/mine.ts')}
];
