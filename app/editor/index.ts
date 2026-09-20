import './editor-style.css';
import {mountEditor} from './editor.ts';
export async function startEditor(){
 if(!import.meta.env.DEV)throw Error('Editor is development-only');
 document.title='Lumenfall Editor v0.1';
 const cleanup=await mountEditor();
 document.getElementById('game')?.remove();document.getElementById('loading')?.remove();
 return cleanup;
}
