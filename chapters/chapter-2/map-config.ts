import type {MapConfig} from '../types.ts';
export const maps:MapConfig[]=[
 {id:0,name:'霧港 セレイン',eyebrow:'SEREIN · THE MISTBOUND HARBOR',description:'濡れた石畳と、帰りを待つ灯',night:true,spawn:{x:0,z:16},load:()=>import('./maps/harbor.ts')},
 {id:1,name:'残灯の桟橋',eyebrow:'THE LAST LANTERN CAUSEWAY',description:'鐘、舟、星。霧の中の道しるべ',night:true,spawn:{x:0,z:18},load:()=>import('./maps/coast.ts')},
 {id:2,name:'潮葬の礼拝堂',eyebrow:'THE DROWNED CHAPEL',description:'半ば海に沈んだ、祈りの跡',night:true,spawn:{x:0,z:18},load:()=>import('./maps/chapel.ts')},
 {id:3,name:'無灯の聖歌廊',eyebrow:'THE CHOIR WITHOUT LIGHT',description:'三つの灯を携え、深い静寂へ',night:true,spawn:{x:0,z:18},load:()=>import('./maps/choir.ts')},
];
