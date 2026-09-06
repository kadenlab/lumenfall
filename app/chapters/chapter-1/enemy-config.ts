import type {EnemyConfig} from '../types.ts';
export const enemies:Record<string,EnemyConfig>={
 slime:{hp:42,attack:9,xp:24,gold:25},
 wolf:{hp:60,attack:14,xp:36,gold:25},
 sentinel:{hp:78,attack:14,xp:36,gold:25},
 'sentinel-east':{hp:78,attack:14,xp:36,gold:25},
 boss:{boss:true,hp:245,attack:18,phaseAttack:23,chargeAttack:43,xp:100,gold:80,fireBonus:9,
 intro:'祭壇の灯が脈打つ。虚ろの灯守が目覚めた。',eyebrow:'GUARDIAN OF THE HOLLOW LIGHT',
 phaseText:'灯守の核が露わになった。森が紫の炎に包まれる！',chargeText:'ヴェルグが光を集めている… 次の一撃に備えよう！',chargeName:'ヴェルグの 月蝕の奔流！'},
};
