export function paintSprite(kind:string,rect:(x:number,y:number,w:number,h:number,color:string)=>void){
 const r=(x:number,y:number,w:number,h:number,color:string)=>rect(Math.round(x*1.5),Math.round(y*1.85),Math.ceil(w*1.5),Math.ceil(h*1.85),color);
 if(['elna','touma','baldo'].includes(kind)){const coat=kind==='elna'?'#4e8f96':kind==='touma'?'#b57845':'#8e3934';r(9,3,14,8,'#423c3b');r(10,8,12,10,'#e4b68c');r(9,18,14,10,coat);r(10,28,5,4,'#353b44');r(18,28,5,4,'#353b44');if(kind==='elna'){r(7,5,18,3,'#cda66b');r(24,18,3,12,'#bec6cc')}if(kind==='touma'){r(23,21,5,6,'#c6eeef');r(24,22,3,3,'#ffffff')}if(kind==='baldo'){r(14,18,3,10,'#dfbc73');r(7,4,18,4,'#513638')}return true}
 if(kind==='ash-eater'){r(3,18,26,10,'#66616a');r(6,13,20,9,'#8a8180');r(5,27,5,4,'#353944');r(22,27,5,4,'#353944');r(7,18,4,3,'#ffc18b');r(21,18,4,3,'#ffc18b');r(11,24,10,3,'#292d37');return true}
 if(kind==='machine-wolf'){r(5,13,22,13,'#59616b');r(6,4,5,12,'#86838a');r(21,4,5,12,'#86838a');r(8,26,5,6,'#40414d');r(20,26,5,6,'#40414d');r(8,16,4,3,'#ffb465');r(21,16,4,3,'#ffb465');r(10,22,15,4,'#e8c9a8');r(14,24,3,5,'#ff9b52');return true}
 if(kind==='lamp-moth'){r(2,8,10,15,'#81a8b9');r(21,8,10,15,'#81a8b9');r(5,11,7,7,'#bddde0');r(21,11,7,7,'#bddde0');r(13,9,7,20,'#484557');r(11,3,3,8,'#dabf8c');r(20,3,3,8,'#dabf8c');r(14,12,5,5,'#e9ffff');return true}return false;
}
