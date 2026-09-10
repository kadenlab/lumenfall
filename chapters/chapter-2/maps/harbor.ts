import type {ChapterContext} from '../../types.ts';
import {foundation,building,lantern,finishMap} from './scenery.ts';
export function build(c:ChapterContext){foundation(c);building(c,-13,-3,7,5.2);building(c,13,-3,8,7);building(c,-13,17,7,4);building(c,15,8,5,4);building(c,-5,-6,4,8.8);
 const rail=c.mat('#667c85',.3),wood=c.mat('#384f58',.5);for(let i=0;i<11;i++){const x=-18+i*3.6;c.cyl(x,.55,-9,.09,1.2,rail);if(Math.abs(x)>4)c.box(x,.85,-9,3.3,.07,.07,rail)}
 for(const [x,z]of [[-4,14],[5,8],[-8,4],[7,-5],[-2,-12],[2,-17]])lantern(c,x,z,true,'#ffcf88');
 // Long low boats and split masts silhouette against the sea.
 for(const x of [-13,13]){c.box(x,-.1,-15,5,.65,10,wood);c.box(x,.7,-14,.15,3.2,.15,rail);c.box(x,2,-14,3,.1,.1,rail);for(const side of [-1,1])c.box(x+side*2.4,.15,-15,.18,.7,10,wood)}
 c.exitMarker(0,-17,'航路灯 → 残灯の桟橋');finishMap(c)}
