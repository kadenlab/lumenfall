import type {MapConfig} from '../types.ts';
export const maps:MapConfig[]=[
 {id:0,name:'白霧の雪原',eyebrow:'THE WHITE VEIL',description:'吹雪の中、青い道標をたどる',night:true,spawn:{x:0,z:17},load:()=>import('./maps/snowfield.ts')},
 {id:1,name:'凍灯の集落',eyebrow:'THE LAST WARM HEARTH',description:'雪に埋もれた窓に、ひとつの灯',night:true,spawn:{x:0,z:17},load:()=>import('./maps/village.ts')},
 {id:2,name:'凍れる旧都',eyebrow:'THE CITY BELOW THE WHITE SPIRE',description:'白嶺の観測塔。雪の下で闇が息づく',night:true,spawn:{x:0,z:17},load:()=>import('./maps/city.ts')},
 {id:3,name:'凍灯聖堂',eyebrow:'THE FROZEN SANCTUARY',description:'凍った祈りと、封印の記録',night:true,spawn:{x:0,z:17},load:()=>import('./maps/cathedral.ts')},
 {id:4,name:'大灯の炉心',eyebrow:'THE THIRD LIGHT',description:'黒い氷に閉ざされた、冬を退ける灯',night:true,spawn:{x:0,z:17},load:()=>import('./maps/furnace.ts')},
];
