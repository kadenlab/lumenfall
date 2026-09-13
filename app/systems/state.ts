import type {GearState} from './gear.ts';
import {freshTrials} from '../trials/state.ts';
import type {TrialState} from '../trials/state.ts';
import {createCampaign} from './progression.ts';
import type {Campaign} from './progression.ts';
export type GameState={gear?:GearState;trials:TrialState;area:number;x:number;z:number;hp:number;mp:number;lv:number;xp:number;gold:number;potions:number;ethers:number;sword:boolean;armor:boolean;time:number;campaign:Campaign};
export const fresh=():GameState=>({trials:freshTrials(),area:0,x:0,z:8,hp:100,mp:30,lv:1,xp:0,gold:35,potions:4,ethers:2,sword:false,armor:false,time:0,campaign:createCampaign()});
