export function paintSprite(kind:string,r:(x:number,y:number,w:number,h:number,color:string)=>void){
 if(!['afterwind','echo-jelly','reverse-frost','ring-remnant'].includes(kind))return false;
 const dark='#25364a',white='#def5ef';
 if(kind==='echo-jelly'){r(10,13,28,7,'#849ed3');r(6,20,36,15,'#587eaa');r(11,23,26,6,'#b5eaff');for(let i=0;i<5;i++){r(9+i*7,33,3,15+i%2*7,'#799cbd');r(10+i*7,46+i%2*7,5,3,'#abeee8')}r(16,29,4,3,dark);r(28,29,4,3,dark)}
 else if(kind==='ring-remnant'){r(12,10,25,9,'#dac89f');r(8,21,32,25,'#536d75');r(4,26,8,20,'#8b9790');r(37,25,7,21,'#8b9790');r(13,43,8,14,dark);r(29,43,8,14,dark);for(let i=0;i<3;i++)r(14+i*8,29,5,8,['#edac79','#b0dcfa','#8ce2b5'][i]);r(20,14,9,3,white)}
 else {const snow=kind==='reverse-frost';r(10,28,29,15,snow?'#aabfd1':'#77876b');r(30,18,13,17,snow?'#d2e7ec':'#a9b38b');r(29,11,5,12,dark);r(39,12,5,11,dark);r(10,42,5,14,dark);r(29,42,5,14,dark);r(2,22,10,7,snow?'#b1e4ef':'#b3c6a2');r(36,24,4,3,'#88fff1');for(let i=0;i<4;i++)r(8+i*5,21-i%2*4,4,12,snow?'#e4fbff':'#e1e8bf')}
 return true;
}
