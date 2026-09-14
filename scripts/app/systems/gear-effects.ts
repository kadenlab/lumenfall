import type {GameState} from './state.ts';
export type GearFight={wind:boolean;resonated:boolean;boostUntil:number};
export const createGearFight=():GearFight=>({wind:false,resonated:false,boostUntil:0});
export function outgoingGear(s:GameState,f:GearFight,b:{hp:number;max:number;boss:boolean;turn:number;command:string},damage:number,rng=Math.random){
 if(damage<=0)return damage;
 if(s.gear?.weapon==='afterwind-sword'&&b.command==='attack'&&rng()<.2)f.wind=true;
 if(s.gear?.weapon==='white-lamp-blade'&&b.hp<=b.max*.3)damage=Math.round(damage*(b.boss?1.06:1.12));
 if(s.gear?.weapon==='lamproad-sword'&&b.boss){if(b.turn>=5&&!f.resonated){f.resonated=true;f.boostUntil=b.turn+1}if(b.turn<=f.boostUntil)damage=Math.round(damage*1.1)}
 return damage;
}
export function incomingGear(s:GameState,f:GearFight,b:{boss:boolean;turn:number},damage:number){
 if(damage<=0)return damage;
 if(f.wind){damage=Math.ceil(damage*.9);f.wind=false}
 if(s.gear?.armor==='ringkeeper-robes'&&b.boss&&b.turn<=3)damage=Math.ceil(damage*.92);
 return damage;
}
export function drainMP(s:GameState,amount:number){const n=Math.min(s.mp,s.gear?.armor==='tidelight-cloak'?Math.ceil(amount*.5):amount);s.mp-=n;return n}
export function endGearBattle(s:GameState){if(s.hp>0&&s.gear?.armor==='tidelight-cloak')s.mp=Math.min(30+(s.lv-1)*8,s.mp+3)}
