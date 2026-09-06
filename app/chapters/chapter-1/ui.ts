import {areas} from './map-config.ts';
import type {ChapterContext} from '../types.ts';
import {view} from './state.ts';
import {dungeonWalls,sealedGate,shrines,gateOpen,dungeonWalkable} from './dungeon.ts';
import {goal as nextGoal} from './events.ts';
export function hud(ctx: ChapterContext) { const s = view(ctx.state); const goal = nextGoal(ctx); return `<div class="top"><div class="region"><small>${areas[s.area][1]}</small><h2>${areas[s.area][0]}</h2><p>${areas[s.area][2]} · ${s.area === 2 ? '月夜' : Math.sin(ctx.clock * .015) > .6 ? '夕暮れ' : '午後'}</p></div><div class="tools"><button class="iconbtn" data-action="sound" aria-label="音の切り替え">${ctx.muted ? '♪̸' : '♪'}</button><button class="iconbtn" data-action="map" aria-label="周辺の案内">⌖</button><button class="iconbtn" data-action="menu" aria-label="冒険メニュー">☰</button></div></div><div class="quest"><small>${s.quest === 3 ? '旅の記憶' : '次の目的地'}</small><div class="journey"><span class="${s.area === 0 ? 'current' : ''}">町</span> › <span class="${s.area === 1 ? 'current' : ''}">草原</span> › <span class="${s.area === 2 ? 'current' : ''}">遺跡</span> › 祭壇</div><span class="quest-copy">${s.quest === 0 ? '灯守のエダに話を聞こう' : s.quest === 3 ? '町に灯が戻った。自由に散策しよう' : s.area === 0 ? '北の道から、琥珀の丘へ' : s.area === 1 ? '街道を北へ進み、星眠りの遺跡へ' : (gateOpen(s.seals, s.quest) ? '双灯の扉が開いた。奥の祭壇へ' : '左右の回廊を探索し、祠の封印を解く（' + s.seals.length + '/2）')}</span>${goal ? `<button class="guide" data-action="guide"><span class="guide-full">${Math.hypot(goal.x - s.x, goal.z - s.z) < goal.r ? 'ここから進む · ' : '⌖ '}${s.area === 0 ? '北門 → 琥珀の丘' : s.area === 1 ? '森の入口 → 星眠りの遺跡' : goal.name}${Math.hypot(goal.x - s.x, goal.z - s.z) < goal.r ? '' : 'まで案内'}</span><span class="guide-compact">${Math.hypot(goal.x - s.x, goal.z - s.z) < goal.r ? '進む · ' : '⌖ '}${s.area === 0 ? '琥珀の丘へ' : s.area === 1 ? '星眠りの遺跡へ' : goal.name}${s.area === 2 && !gateOpen(s.seals, s.quest) ? '　' + s.seals.length + '/2' : ''}</span></button>` : ''}</div>`; }
export function modalUI(ctx: ChapterContext) {
    const s = view(ctx.state);
    let h = "";
    if (ctx.modal.startsWith('seal-')) {
        const shrine = shrines.find(a => a.id === ctx.modal.slice(5))!;
        h += `<div class="overlay"><div class="panel"><div class="eyebrow">SEAL OF THE TWIN LIGHTS</div><h2>${shrine.name}</h2><p>番獣の気配は消えた。<br>台座に捧げる紋章を選ぼう。<br><br>石碑の言葉：<br>「西には、夜を照らす静かな円。<br>東には、朝を告げる燃える円。」</p>${ctx.btn('glyph-moon', '月の紋章')}${ctx.btn('glyph-sun', '太陽の紋章')}${ctx.btn('glyph-star', '星の紋章')}${ctx.btn('close', 'あとで考える')}</div></div>`;
    }
    if (ctx.modal === 'shop')
        h += `<div class="overlay"><div class="panel"><div class="eyebrow">LYUNE TRADING POST</div><h2>旅支度の店</h2><p>「小さな備えが、旅を助けるよ。」<br>所持金：${s.gold} G</p>${ctx.btn('buy-potion', '薬草　15 G　／ HP +65', s.gold < 15)}${ctx.btn('buy-ether', '星の雫　20 G　／ MP +20', s.gold < 20)}${ctx.btn('buy-sword', s.sword ? '暁鉄の剣　装備中' : '暁鉄の剣　40 G　／ 攻撃 +9', s.sword || s.gold < 40)}${ctx.btn('buy-armor', s.armor ? '織星の外套　装備中' : '織星の外套　35 G　／ 被ダメージ −5', s.armor || s.gold < 35)}${ctx.btn('close', '店を出る')}</div></div>`;
    if (ctx.modal === 'inn')
        h += `<div class="overlay"><div class="panel"><div class="eyebrow">THE WATERBIRD INN</div><h2>水鳥亭</h2><p>「今夜は、窓の灯を消さずにおくよ。」<br>一泊 10 G。HP・MPをすべて回復します。<br>所持金：${s.gold} G</p>${ctx.btn('rest', s.gold >= 10 ? 'ひと休みする　10 G' : 'ひと休みする（今回は無料）')}${ctx.btn('close', '宿を出る')}</div></div>`;
    return h;
}
export function endingUI(ctx: ChapterContext) { const s = view(ctx.state); return `<div class="overlay"><div class="panel ending"><div class="eyebrow">THE LIGHT WILL LIVE ON</div><h1>そして、灯はつづく</h1><div class="sep"></div><p>朝の光が、水路を金色に染めた。<br>名もなき小さな勇気が、<br>今日も誰かの窓に灯をともす。</p><p>リオとミナの旅は、ここでひと休み。<br>けれど、世界にはまだ多くの夜がある。</p><div class="badge">CHAPTER 1 CLEAR</div><p style="font-size:12px">到達レベル ${s.lv} · 討伐 ${s.wins.length} · 宝箱 ${s.chests.length}/4</p>${ctx.btn('after', '灯の戻った町へ')}</div></div>`; }
