import type {ChapterContext} from '../types.ts';
export type Placement={id:string;kind:string;name:string;x:number;z:number;sprite?:string;scale?:number;destination?:number};
const exit=(id:string,name:string,x:number,z:number,destination:number):Placement=>({id,kind:'exit',name,x,z,destination});
const person=(id:string,name:string,x:number,z:number,sprite='villager'):Placement=>({id,kind:'npc',name,x,z,sprite});
const prop=(id:string,name:string,x:number,z:number,kind='record'):Placement=>({id,kind,name,x,z});
export const placements:Record<number,Placement[]>={
 0:[{id:'sea',kind:'previous',name:'無響の港へ戻る',x:-3,z:16},person('refugee','灰を払う避難民',4,8),exit('city','下層区へ',0,-16,1)],
 1:[exit('road','街道へ',0,18,0),person('elna','整備士 エルナ',-4,10,'elna'),person('touma','灯を守る少年 トウマ',5,4,'touma'),person('resident','配熱管を抱く住民',-6,1),person('letter-owner','作業員の家族 サラ',6,-6),prop('rest','作業場の休憩所',-9,12,'spring'),{id:'shop',kind:'shop',name:'下層区の道具商',x:8,z:12,sprite:'merchant'},exit('office','炉政庁へ',8,-16,2),exit('conduit','地下送灯路へ',-8,-16,3)],
 2:[exit('lower','下層区へ',0,18,1),person('baldo','大炉管理長 バルド',-4,-3,'baldo'),prop('office-record','大炉の稼働記録',4,-9)],
 3:[exit('lower','下層区へ',0,18,1),prop('hint','送灯路の点検記録',-6,11),prop('cooling','① 冷却装置',-7,3,'device'),prop('distribution','② 分配装置',7,-3,'device'),prop('power','③ 通電装置',-6,-10,'device'),prop('letter','煤けた作業員の手紙',8,7),exit('mine','廃灰坑道へ',0,-17,4)],
 4:[exit('conduit','送灯路から下層区へ戻る',0,18,3),prop('mine-record','旧分灯設備の記録',-5,-7),prop('sealed','地下深部の閉鎖通路',0,-17)]
};
placements[0].push({id:'ash-eater',kind:'enemy',name:'灰喰い',x:0,z:-3,sprite:'ash-eater',scale:2.7});
placements[3].push({id:'machine-wolf',kind:'enemy',name:'焼け歯の機狼',x:0,z:5,sprite:'machine-wolf',scale:2.8});
placements[4].push({id:'lamp-moth',kind:'enemy',name:'灯吸い蛾',x:2,z:1,sprite:'lamp-moth',scale:2.7});
export const treasures:Record<string,{area:number;x:number;z:number;gold:number;potions:number;ethers:number}>={
 'lower-cache':{area:1,x:-10,z:-7,gold:80,potions:2,ethers:1},
 'conduit-cache':{area:3,x:8,z:-10,gold:90,potions:2,ethers:2},
 'mine-cache':{area:4,x:8,z:-9,gold:120,potions:3,ethers:2}
};
export function place(c:ChapterContext){if(c.sceneryOnly)return;for(const p of placements[c.state.area]){if(p.kind==='enemy'&&c.progress.defeatedEnemies.includes(p.id))continue;const o=c.addObj(p.kind,p.name,p.x,p.z,p.id);if(p.sprite)o.mesh=c.sprite(p.sprite,p.x,p.z,p.scale);if(p.kind==='exit')c.exitMarker(p.x,p.z,p.name)}for(const [id,t] of Object.entries(treasures))if(t.area===c.state.area)c.chest(t.x,t.z,id)}
