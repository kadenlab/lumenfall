import type {Foe} from './rules.ts';
export const foeColors=['#9fe8ff','#ffc98e','#c8b6ff','#a5f1ba','#ffacba','#fff0a0'];
export function foeKind(f:Foe){return f.name.includes('蛾')?'trial-moth':f.name.includes('弓手')?'trial-archer':f.name.includes('番獣')?'trial-beast':f.name.includes('灯喰らい')?'trial-5':f.name.includes('影')?'trial-shade':'trial-soldier'}
export function paintFoe(kind:string,r:(x:number,y:number,w:number,h:number,c:string)=>void){
 if(kind==='trial-moth'){for(let i=0;i<4;i++){r(2+i*3,15+i*5,17-i*2,9,'#7d9ebd');r(29,15+i*5,17-i*2,9,'#7d9ebd')}r(9,24,6,8,'#ffe9aa');r(34,24,6,8,'#ffe9aa');r(22,14,5,35,'#244753');r(20,10,9,8,'#beffec');return true}
 if(kind==='trial-archer'){r(17,9,16,13,'#7fb6ac');r(19,21,12,9,'#dbddbc');r(15,31,20,19,'#4d817b');r(16,48,6,13,'#294859');r(28,48,6,13,'#294859');r(39,13,3,36,'#d9c695');r(43,20,2,23,'#c4a47e');r(35,9,5,6,'#d9c695');r(35,49,5,6,'#d9c695');r(31,33,15,2,'#e6ffff');return true}
 if(kind==='trial-beast'){r(8,29,33,20,'#778fab');r(4,23,18,15,'#aac9dc');r(4,16,5,10,'#88adbf');r(17,16,5,10,'#88adbf');r(6,32,4,3,'#e5ffed');r(9,46,7,14,'#345167');r(30,46,7,14,'#345167');r(40,22,5,19,'#a3b8d7');r(14,35,17,7,'#476778');return true}
 if(kind==='trial-shade'){for(let y=10;y<60;y++){const w=Math.round(6+(y-10)*.24);r(24-w,y,w*2,1,y<26?'#afbadc':y<43?'#647896':'#364459')}r(20,21,3,3,'#d6fffa');r(27,21,3,3,'#d6fffa');r(3,35,8,4,'#b1c3dd');r(37,35,8,4,'#b1c3dd');return true}return false;
}
