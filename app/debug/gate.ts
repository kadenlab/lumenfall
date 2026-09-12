/** Query settings never persist implicitly; ?debug=0 always overrides storage. */
export function debugEnabled(search:string,storage:Pick<Storage,'getItem'>){const q=new URLSearchParams(search).get('debug');if(q!==null)return q==='1';try{return storage.getItem('lumenfall-debug')==='1'}catch{return false}}
export const DEBUG_SAVE='lumenfall-debug-save';
export function debugStorage(storage:Pick<Storage,'getItem'|'setItem'|'removeItem'>){return {getItem(key:string){return key==='lumenfall-save'?storage.getItem(DEBUG_SAVE)??storage.getItem(key):storage.getItem(key)},setItem(_key:string,value:string){storage.setItem(DEBUG_SAVE,value)},removeItem(){storage.removeItem(DEBUG_SAVE)}}}
