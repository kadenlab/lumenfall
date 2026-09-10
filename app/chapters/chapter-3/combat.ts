/** Command-driven chapter mechanics. No timers or frame allocations. */
export type WinterFight={shieldUntil:number;freeze:number;thaw:boolean;phase:number;phaseAt:number;frozenStrike:boolean};
export const createFight=():WinterFight=>({shieldUntil:0,freeze:0,thaw:false,phase:1,phaseAt:-100,frozenStrike:false});
export function forecast(id:string,next:number,phase=1,phaseAt=-100){
 if(id==='frost')return next%2===0?'双霜爪：二連撃。防御で軽減':'爪の一撃';
 if(id==='soldier'||id==='warden')return next%3===1?'氷盾を構える：星火で破壊、続く2行動は弱体':'氷刃の一撃';
 if(id==='shade')return next%3===0?'白霧：剣の威力 −25%。星火なら通常':'霧は薄い：剣・星火とも有効';
 if(id==='hunter')return '吸光：星火ならMP吸収を阻止し、反撃も軽減';
 const n=next%8;
 if(phase===2&&n===6)return '雪崩まで3行動。回復・MP補給の準備を';
 if(phase===2&&n===7)return '雪崩まで2行動。次は回復・準備、その次は防御';
 if(phase===2&&n===0&&next-phaseAt>=2)return '雪崩：今、防御！';
 if(n===3)return '氷葬まで2行動。次は準備、その次は防御';
 if(n===4)return '氷葬：今、防御！';
 if(n===1)return '凍灯：大灯が凍り始める。2行動以内に星火';
 if(n===5)return '白夜（2行動）：剣の威力 −20%。星火は有効';
 return '氷刃／霜鎧：星火で氷をほどく';
}
export function deal(r:WinterFight,id:string,turn:number,cmd:string,base:number){
 if(id==='aurel'){
  if(turn%8===1)r.freeze=2;
  r.thaw=r.freeze>0&&cmd==='fire';
  if(r.thaw)r.freeze=0;
 }
 if((id==='warden'||id==='soldier')&&turn%3===1&&cmd==='fire')r.shieldUntil=turn+2;
 if(!base)return 0;
 if(id==='warden'||id==='soldier')return Math.round(base*(turn<=r.shieldUntil?1.45:turn%3===1?.3:cmd==='attack'?.8:1));
 if(id==='frost'&&turn%2===0&&cmd==='attack')return Math.round(base*.85);
 if(id==='shade'&&turn%3===0&&cmd==='attack')return Math.round(base*.75);
 if(id==='aurel'&&cmd==='attack')return Math.round(base*(turn%8===5||turn%8===6?.8:turn%8===2?.7:1));
 return base;
}
export function retaliation(r:WinterFight,id:string,turn:number,cmd:string,phase:number){
 if(phase===2&&r.phase!==2)r.phaseAt=turn;
 r.phase=phase;r.frozenStrike=false;
 if(id==='frost')return turn%2===0?36:22;
 if(id==='soldier')return turn%3===1?8:23;
 if(id==='shade')return turn%3===0?20:25;
 if(id==='hunter')return cmd==='fire'?13:29;
 if(id==='warden')return turn%3===1?10:turn<=r.shieldUntil?18:32;
 let attack=phase===2?27:23;
 if(turn%8===4)attack=phase===2?80:68;
 if(phase===2&&turn%8===0&&turn-r.phaseAt>=2)attack=100;
 if(r.freeze>0){r.freeze--;if(r.freeze===0){attack+=45;r.frozenStrike=true}}
 return attack;
}
