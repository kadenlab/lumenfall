import type {ChapterContext} from '../types.ts';
import {maps} from './map-config.ts';
import {flags} from './state.ts';
import {goal} from './events.ts';
export function hud(c:ChapterContext){const m=maps[c.state.area],g=goal(c),f=flags(c.state);return `<div class=top><div class=region><small>${m.eyebrow}</small><h2>${m.name}</h2><p>${m.description}</p></div><div class=tools><button class=iconbtn data-action=sound aria-label=音の切り替え>♪</button><button class=iconbtn data-action=map aria-label=周辺の案内>⌖</button><button class=iconbtn data-action=menu aria-label=冒険メニュー>☰</button></div></div><div class=quest><small>CHAPTER 5 · 灰に沈む灯</small><span class=quest-copy>${f.part1Complete?'前半調査を記録。旧分灯塔の準備は後半へ。':f.officeRecord&&f.mineRecord?'二つの記録をエルナに報告しよう。':'炉政庁と地下の記録を探す。調査順は自由。'}</span>${g?`<button class=guide data-action=guide>⌖ ${g.name}</button>`:''}<button class="guide chapter-notebook" data-action=ash-notes>灰炉の調査帳</button></div>`}
export function modalUI(c:ChapterContext){const f=flags(c.state),b=c.btn;let h='';if(c.modal==='shop')h=`<h2>下層区の道具商</h2><p>所持金 ${c.state.gold} G</p>${b('buy-potion','薬草 15 G ／ HP +65',c.state.gold<15)}${b('buy-ether','星の雫 20 G ／ MP +20',c.state.gold<20)}${b('close','店を出る')}`;
 if(c.modal==='ash-notes')h=`<h2>灰炉の調査帳</h2><p>エルナに相談 → 炉政庁／地下（順不同） → 二つの記録をエルナへ。</p><p>炉政庁記録：${f.officeRecord?'取得済み':'未取得'}<br>廃灰坑道記録：${f.mineRecord?'取得済み':'未取得'}<br>送灯路：${f.passageRestored?'開通':`${Number(f.puzzleStep)||0}/3`}（冷却 → 分配 → 通電）<br>煤けた手紙：${c.progress.quests['soot-letter']==='complete'?'届けた':f.letterFound?'サラへ届けよう':'未発見'}</p><p>休憩所は無料。坑道から送灯路、下層区へ戻れる。<br>${f.part1Complete?'前半終了。旧分灯塔は後半で調査する。中央炉はまだ止めない。':'二つの記録をそろえて、街を支える方法を考えよう。'}</p>${b('close','閉じる')}`;
 return h?`<div class=overlay><div class="panel winter-panel">${h}</div></div>`:'';
}
