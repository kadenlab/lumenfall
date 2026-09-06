import type * as T from 'three';
import type {GameState} from '../systems/state.ts';
import type {ChapterProgress} from '../systems/progression.ts';
export type WorldObject={x:number;z:number;r:number;name:string;kind:string;id:string;mesh?:T.Object3D};
/** Capability boundary: chapter content can use world primitives and game actions, never renderer/input internals. */
export type ChapterContext={
 state:GameState;progress:ChapterProgress;world:T.Group;scene:T.Scene;ambient:T.HemisphereLight;sun:T.DirectionalLight;
 objects:WorldObject[];blocks:{x:number;z:number;w:number;d:number}[];mats:Record<string,T.MeshStandardMaterial>;
 modal:string;mode:string;clock:number;muted:boolean;companion:T.Sprite;near?:WorldObject;
 box:(...args:any[])=>T.Mesh;cyl:(...args:any[])=>T.Mesh;mat:(color:string,roughness?:number)=>T.MeshStandardMaterial;
 house:(...args:any[])=>void;water:(...args:any[])=>void;tree:(...args:any[])=>void;torch:(x:number,z:number)=>void;light:(...args:any[])=>void;
 sprite:(kind:string,x:number,z:number,scale?:number)=>T.Sprite;chest:(x:number,z:number,id:string)=>void;
 addObj:(kind:string,name:string,x:number,z:number,id?:string)=>WorldObject;exitMarker:(x:number,z:number,label:string)=>void;
 height:(x:number,z:number)=>number;rand:(n:number)=>number;build:()=>void;save:()=>void;notify:(text:string)=>void;
 talk:(speaker:string,lines:string[],after?:()=>void)=>void;renderUI:()=>void;burst:(...args:any[])=>void;
 transition:(area:number)=>Promise<void>;startBattle:(object:WorldObject)=>void;maxHP:()=>number;maxMP:()=>number;
 switchChapter:(id:string)=>Promise<void>;btn:(id:string,label:string,disabled?:boolean)=>string;finish:()=>void;
};
export type MapConfig={id:number;name:string;eyebrow:string;description:string;night:boolean;spawn:{x:number;z:number};load:()=>Promise<{build:(ctx:ChapterContext)=>void}>};
export type EnemyConfig={hp:number;attack:number;xp:number;gold:number;boss?:boolean;fireBonus?:number;intro?:string;eyebrow?:string;phaseAttack?:number;chargeAttack?:number;chargeText?:string;chargeName?:string;phaseText?:string};
export type Chapter={
 paintSprite:(kind:string,rect:(x:number,y:number,w:number,h:number,color:string)=>void)=>boolean;id:string;title:string;unlockNext:string[];maps:MapConfig[];enemies:Record<string,EnemyConfig>;
 start:{area:number;x:number;z:number};returnTo:{area:number;x:number;z:number};respawn:{area:number;x:number;z:number};
 entry:(area:number,from:number)=>{x:number;z:number};initialize:(s:GameState)=>void;normalize:(s:GameState)=>void;height:(s:GameState,x:number,z:number)=>number;
 walkable:(s:GameState,x:number,z:number)=>boolean;hasCompanion:(s:GameState)=>boolean;
 goal:(ctx:ChapterContext)=>WorldObject|undefined;begin:(ctx:ChapterContext)=>void;enter:(ctx:ChapterContext,from:number)=>void;
 interact:(ctx:ChapterContext,o:WorldObject)=>boolean|void;action:(ctx:ChapterContext,a:string)=>boolean;
 hud:(ctx:ChapterContext)=>string;modalUI:(ctx:ChapterContext)=>string;endingUI:(ctx:ChapterContext)=>string;
 objectVisibleInGuide:(ctx:ChapterContext,o:WorldObject)=>boolean;onBossVictory:(ctx:ChapterContext,id:string)=>void;
 onEnding:(ctx:ChapterContext)=>void;onDefeat:(ctx:ChapterContext)=>void;onRest:(ctx:ChapterContext)=>void;
 music:{field:number[];night:number[];battle:number[]};effects:{phaseFog:string;phaseDensity:number;phaseSun:string};
 vegetation:(s:GameState,x:number,z:number)=>boolean;
};
