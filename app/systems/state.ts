import {createCampaign} from './progression.ts';
import type {Campaign} from './progression.ts';
export type GameState={area:number;x:number;z:number;hp:number;mp:number;lv:number;xp:number;gold:number;potions:number;ethers:number;sword:boolean;armor:boolean;time:number;campaign:Campaign};
export const fresh=():GameState=>({area:0,x:0,z:8,hp:100,mp:30,lv:1,xp:0,gold:35,potions:4,ethers:2,sword:false,armor:false,time:0,campaign:createCampaign()});
