import type {ChapterContext} from '../types.ts';
import {won,flags} from './state.ts';
export type Placement={id:string;kind:string;name:string;x:number;z:number;sprite?:string;scale?:number;destination?:number};
const exit=(id:string,name:string,x:number,z:number,destination:number):Placement=>({id,kind:'exit',name,x,z,destination});
const enemy=(id:string,name:string,x:number,z:number,sprite:string,boss=false):Placement=>({id,kind:boss?'boss':'enemy',name,x,z,sprite,scale:boss?5:2.7});
export const placements:Record<number,Placement[]>={
 0:[{id:'north',kind:'previous',name:'雪の旧都へ戻る',x:-2,z:16},exit('port','無響の港へ',0,-17,1)],
 1:[exit('entrance','環海入口へ',0,18,0),{id:'rau',kind:'npc',name:'港守 ラウ',x:-4,z:11,sprite:'rau'},{id:'sena',kind:'npc',name:'潮読み セナ',x:7,z:6,sprite:'sena'},{id:'ordo',kind:'npc',name:'石工 オルド',x:-7,z:-1,sprite:'ordo'},{id:'shop',kind:'shop',name:'環海の船具店',x:8,z:12,sprite:'merchant'},{id:'rest',kind:'spring',name:'港の宿で休む',x:-9,z:12},exit('west','西環島へ',-9,-13,2),exit('east','東環島へ',9,-13,3),exit('ruins','環状遺跡へ',0,-17,4)],
 2:[exit('port','港へ戻る',0,18,1),enemy('biter','潮噛み',-4,7,'biter'),enemy('jelly','無響クラゲ',3,-2,'jelly'),{id:'mark-west',kind:'marker',name:'西の航路標',x:-11,z:5},{id:'west',kind:'beacon',name:'西の環灯を復旧する',x:0,z:-13}],
 3:[exit('port','港へ戻る',0,18,1),enemy('shell','環殻兵',-4,6,'shell'),enemy('ray','灯吸いエイ',4,-3,'ray'),{id:'mark-east',kind:'marker',name:'東の航路標',x:8,z:6},{id:'east',kind:'beacon',name:'東の環灯を復旧する',x:0,z:-13}],
 4:[exit('port','港へ戻る',0,18,1),enemy('biter-2','潮噛み',-8,5,'biter'),enemy('shell-2','環殻兵',8,1,'shell'),{id:'mark-ring',kind:'marker',name:'中央の航路標',x:-10,z:-3},enemy('seawarden','無響の海守',0,-10,'seawarden',true),exit('corridor','沈灯回廊へ',0,-18,5)],
 5:[exit('ruins','環状遺跡へ戻る',0,18,4),{id:'rest',kind:'spring',name:'残った分かち火で休む',x:3,z:12},enemy('jelly-2','無響クラゲ',-3,6,'jelly'),enemy('ray-2','灯吸いエイ',3,0,'ray'),{id:'tablet',kind:'tablet',name:'石工の古い石板',x:9,z:-3},{id:'cut',kind:'lore',name:'灯路の切断面を調べる',x:0,z:-11},exit('altar','中央祭壇へ',0,-18,6)],
 6:[exit('corridor','回廊へ戻る',0,18,5),{id:'van',kind:'npc',name:'巡礼者 ヴァン',x:0,z:-5,sprite:'van'},{id:'rest',kind:'spring',name:'祭壇の分かち火',x:5,z:9},exit('heart','環海の心臓へ',0,-18,7)],
 7:[exit('altar','中央祭壇へ戻る',0,18,6),{id:'rest',kind:'spring',name:'戦いの前に休む',x:5,z:12},enemy('ignas','環海の守人 イグナス',0,-5,'ignas',true),{id:'memory',kind:'ending',name:'中央祭壇の記録を読む',x:0,z:-5}]
};
export const treasures:Record<string,{area:number;x:number;z:number;gold:number;potions:number;ethers:number;gear?:string}>={
 port:{area:1,x:12,z:0,gold:75,potions:2,ethers:1},west:{area:2,x:-5,z:-8,gold:60,potions:3,ethers:2},east:{area:3,x:8,z:-8,gold:0,potions:1,ethers:2,gear:'still-blade'},ring:{area:4,x:11,z:-10,gold:120,potions:2,ethers:2},hall:{area:5,x:9,z:1,gold:80,potions:2,ethers:3},altar:{area:6,x:-9,z:1,gold:100,potions:3,ethers:3}
};
export function place(c:ChapterContext){for(const p of placements[c.state.area]){if((p.kind==='enemy'||p.kind==='boss')&&won(c.state,p.id))continue;if(p.kind==='ending'&&!won(c.state,'ignas'))continue;if(p.id==='van'&&won(c.state,'ignas'))continue;const o=c.addObj(p.kind,p.name,p.x,p.z,p.id);if(p.kind==='boss'||p.id==='memory')o.r=3.3;if(p.sprite)o.mesh=c.sprite(p.sprite,p.x,p.z,p.scale);if(p.kind==='exit')c.exitMarker(p.x,p.z,p.name)}for(const [id,t]of Object.entries(treasures))if(t.area===c.state.area)c.chest(t.x,t.z,id);if(c.state.area===1&&won(c.state,'ignas')&&!c.progress.completed)c.addObj('ending','航路の帰還報告',-4,8,'return')}
