import {fresh} from './state.ts';
import type {GameState} from './state.ts';
import {hasSave,readSave} from './save.ts';
import {loadChapter} from '../chapters/registry.ts';
/** Read-only startup: corruption/import failure must never become a new game. */
export async function prepareLoad(source:GameState,loader=loadChapter){const state=structuredClone(source),chapter=await loader(state.campaign.currentChapter);chapter.initialize(state);chapter.normalize(state);const selected=chapter.maps.find(m=>m.id===state.area);if(!selected)throw Error('マップが見つかりません');const map=await selected.load();return {state,chapter,map}}
export async function initialLoad(storage:Pick<Storage,'getItem'>,loader=loadChapter){return prepareLoad(hasSave(storage)?readSave(storage):fresh(),loader)}
/** Installation is synchronous; no autosave is allowed until it succeeds. */
export function installSafely(install:()=>void,rollback:()=>void){try{install()}catch(error){try{rollback()}catch(recovery){throw new AggregateError([error,recovery],'描画の復旧に失敗しました。記録は保持されています。再読み込みしてください。')}throw error}}
