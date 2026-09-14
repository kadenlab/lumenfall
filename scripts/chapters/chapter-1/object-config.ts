import type {ChapterContext} from '../types.ts';
import {view} from './state.ts';
export type Placement={id:string;kind:string;name:string;x:number;z:number;sprite?:string;scale?:number;destination?:number};
export const placements:Record<number,Placement[]>={
 0:[{id:'elder',kind:'elder',name:'灯守のエダ',x:1,z:1,sprite:'npc'},{id:'shop',kind:'shop',name:'道具と装備の店',x:7,z:0,sprite:'npc'},{id:'inn',kind:'inn',name:'宿屋「水鳥亭」',x:-12,z:2,sprite:'mage'},{id:'field',kind:'exit',name:'琥珀の丘へ',x:1,z:-20,destination:1}],
 1:[{id:'traveler',kind:'traveler',name:'旅の薬師',x:3,z:13,sprite:'mage'},{id:'slime',kind:'enemy',name:'露玉プルム',x:0,z:5,sprite:'slime',scale:2},{id:'wolf',kind:'enemy',name:'灰羽の獣',x:-1,z:-7,sprite:'wolf',scale:2.3},{id:'town',kind:'exit',name:'リュネの町へ',x:0,z:21,destination:0},{id:'forest',kind:'exit',name:'星眠りの遺跡へ',x:0,z:-21,destination:2}],
 2:[{id:'tablet',kind:'tablet',name:'入口の石碑',x:2,z:16},{id:'spring',kind:'spring',name:'灯の泉',x:2,z:-10.5},{id:'field',kind:'exit',name:'琥珀の丘へ',x:0,z:21,destination:1}],
};
export const treasures:Record<string,{area:number;x:number;z:number;name:string;gold:number;potions:number;ethers:number}>={
 town:{area:0,x:12,z:10,name:'宝箱を開ける',gold:25,potions:2,ethers:0},
 field:{area:1,x:6,z:5,name:'宝箱を開ける',gold:25,potions:2,ethers:0},
 forest:{area:2,x:-14,z:15,name:'西回廊の宝箱',gold:25,potions:2,ethers:2},
 sanctum:{area:2,x:14,z:-5,name:'東の隠し宝箱',gold:25,potions:2,ethers:0},
};
export function placeObjects(ctx:ChapterContext){const s=view(ctx.state);for(const p of placements[s.area]??[]){if(p.kind==='enemy'&&s.wins.includes(p.id))continue;const mesh=p.sprite?ctx.sprite(p.sprite,p.x,p.z,p.scale):undefined;const o=ctx.addObj(p.kind,p.name,p.x,p.z,p.id);if(mesh)o.mesh=mesh}for(const [id,c] of Object.entries(treasures)){if(c.area!==s.area)continue;ctx.chest(c.x,c.z,id);ctx.objects[ctx.objects.length-1].name=s.chests.includes(id)?'空の宝箱':c.name}}
