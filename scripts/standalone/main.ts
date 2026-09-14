import '../app/globals.css';
import {startGame} from '../app/game';
async function boot(){try{await startGame()}catch(error){const host=document.getElementById('loading')??document.getElementById('ui')!;host.replaceChildren();const panel=document.createElement('div');panel.className='panel';const title=document.createElement('h2');title.textContent='冒険を読み込めませんでした';const text=document.createElement('p');text.textContent='セーブは変更していません。通信状態を確認し、再読み込みしてください。 '+(error instanceof Error?error.message:'');const button=document.createElement('button');button.textContent='再読み込み';button.onclick=()=>location.reload();panel.append(title,text,button);host.append(panel)}}
void boot();
