export type Wall={x:number,z:number,w:number,d:number};
export const dungeonWalls:Wall[]=[
 {x:-17,z:0,w:1,d:44},{x:17,z:0,w:1,d:44},
 {x:-10,z:21,w:14,d:1},{x:10,z:21,w:14,d:1},
 {x:0,z:-21,w:35,d:1},
 {x:-10,z:-8,w:14,d:1},{x:10,z:-8,w:14,d:1},
 {x:-4,z:1,w:1,d:16},{x:4,z:1,w:1,d:16},
 {x:-14.5,z:9,w:5,d:1},{x:-6,z:9,w:4,d:1},
 {x:14.5,z:9,w:5,d:1},{x:6,z:9,w:4,d:1},
 {x:-8,z:2,w:8,d:1},{x:8,z:2,w:8,d:1},
];
export const sealedGate:Wall={x:0,z:-8,w:6,d:1};
export const shrines=[
 {id:'west',x:-10,z:-4,name:'月影の祠',guardian:'sentinel',enemy:'月影の番獣',gx:-14,gz:4,answer:'moon',color:'#92bcff'},
 {id:'east',x:10,z:-4,name:'暁光の祠',guardian:'sentinel-east',enemy:'暁光の番獣',gx:14,gz:4,answer:'sun',color:'#ffc481'},
];
export const gateOpen=(seals:string[],quest:number)=>quest===3||['west','east'].every(id=>seals.includes(id));
export function dungeonWalkable(x:number,z:number,seals:string[],quest=1){return x>-16.25&&x<16.25&&z>-20.25&&z<22&&!dungeonWalls.concat(gateOpen(seals,quest)?[]:[sealedGate]).some(b=>Math.abs(x-b.x)<b.w/2+.23&&Math.abs(z-b.z)<b.d/2+.23)}
