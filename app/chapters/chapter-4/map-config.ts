import type {MapConfig} from '../types.ts';
export const maps:MapConfig[]=[
 {id:0,name:'環海入口',eyebrow:'THE SILENT RING',description:'波は動き、音だけが遠ざかる。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/entrance.ts')},
 {id:1,name:'無響の港',eyebrow:'HARBOR WITHOUT ECHO',description:'薄金の窓。帰れない船。残された航路。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/harbor.ts')},
 {id:2,name:'西環島',eyebrow:'WESTERN BEACON',description:'潮風の草と、倒れた灯柱。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/west.ts')},
 {id:3,name:'東環島',eyebrow:'EASTERN OBSERVATORY',description:'星を測った石盤が、海の底を指す。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/east.ts')},
 {id:4,name:'環状遺跡',eyebrow:'THE DISTRIBUTION RINGS',description:'幾重の円環。海底へ光を分かつ装置。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/ruins.ts')},
 {id:5,name:'沈灯回廊',eyebrow:'THE SEVERED CURRENT',description:'壁の内側で、光の流れが途切れている。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/corridor.ts')},
 {id:6,name:'中央祭壇',eyebrow:'A PILGRIM AT THE ALTAR',description:'異なる紋章をまとう、ひとりの旅人。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/altar.ts')},
 {id:7,name:'環海の心臓',eyebrow:'IGNAS · KEEPER OF THE RING',description:'三つの灯が、海を支え続ける。',night:true,spawn:{x:0,z:17},load:()=>import('./maps/heart.ts')}
];
