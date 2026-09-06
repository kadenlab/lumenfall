import {placements,treasures} from './object-config.ts';
import {dialogues} from './dialogue-config.ts';
import * as T from 'three';
import type {ChapterContext} from '../types.ts';
import {view} from './state.ts';
import {dungeonWalls,sealedGate,shrines,gateOpen,dungeonWalkable} from './dungeon.ts';
export function goal(ctx: ChapterContext) { const s = view(ctx.state); if (s.quest === 0 || s.quest === 3)
    return undefined; if (s.area === 0)
    return ctx.objects.find(o => o.id === 'field'); if (s.area === 1)
    return ctx.objects.find(o => o.id === 'forest'); const shrine = shrines.find(a => !s.seals.includes(a.id)); if (shrine)
    return ctx.objects.find(o => o.id === (s.wins.includes(shrine.guardian) ? shrine.id : shrine.guardian)); return ctx.objects.find(o => o.id === (!s.springUsed ? 'spring' : 'boss')); }
export function begin(ctx: ChapterContext) { const s = view(ctx.state); ctx.talk('灯守のエダ', dialogues.intro, () => { s.quest = 1; ctx.companion.visible = true; ctx.save(); ctx.notify('ミナが同行した。北の森へ向かおう'); }); }
export function interact(ctx: ChapterContext, o: import("../types.ts").WorldObject) {
    const s = view(ctx.state);
    if (o.kind === 'elder') {
        if(s.quest===0){begin(ctx);return true}
        ctx.talk('灯守のエダ', s.quest === 3 ? dialogues.elderCleared : dialogues.elderQuest);
    }
    if (o.kind === 'tablet')
        ctx.talk('入口の石碑', dialogues.tablet);
    if (o.kind === 'seal') {
        const shrine = shrines.find(a => a.id === o.id)!;
        if (s.seals.includes(o.id)) {
            ctx.talk(shrine.name, dialogues.sealComplete);
            return;
        }
        if (!s.wins.includes(shrine.guardian)) {
            ctx.talk('ミナ', [shrine.enemy + 'の気配が、祠を覆っている。先に回廊の番獣を鎮めよう。']);
            return;
        }
        ctx.modal = 'seal-' + o.id;
        ctx.renderUI();
    }
    if (o.kind === 'gate')
        ctx.talk('双灯の扉', gateOpen(s.seals, s.quest) ? dialogues.gateOpen : ['扉は固く閉ざされている。左右の回廊にある二つの祠の封印を解除しよう。', '解放した祠：' + s.seals.length + ' / 2']);
    if (o.kind === 'spring') {
        if (s.springUsed) {
            ctx.talk('灯の泉', dialogues.springEmpty);
            return;
        }
        s.hp = ctx.maxHP();
        s.mp = ctx.maxMP();
        s.springUsed = true;
        ctx.save();
        ctx.talk('灯の泉', dialogues.springHeal);
    }
    if (o.kind === 'shop') {
        ctx.modal = 'shop';
        ctx.renderUI();
    }
    if (o.kind === 'inn') {
        ctx.modal = 'inn';
        ctx.renderUI();
    }
    if (o.kind === 'traveler')
        ctx.talk('旅の薬師', dialogues.traveler);
    if (o.kind === 'chest') {
        if (s.chests.includes(o.id)) {
            ctx.notify('宝箱は空っぽだ');
            return;
        }
        s.chests.push(o.id);
        const reward=treasures[o.id];
        s.gold += reward.gold;
        s.potions += reward.potions;
        s.ethers += reward.ethers;
        o.name = '空の宝箱';
        ctx.save();
        ctx.talk('宝箱', ['25 G と 薬草 ×2 を手に入れた！' + (o.id === 'forest' ? ' 星の雫 ×2 も入っていた。' : '')]);
    }
    if (o.kind === 'exit') {
        if (s.quest === 0) {
            ctx.talk('ミナ', dialogues.beforeDeparture);
            return;
        }
        const exit=placements[s.area].find(p=>p.id===o.id);if(exit?.destination!==undefined)void ctx.transition(exit.destination).catch(()=>{});
    }
    if (o.kind === 'boss' && !gateOpen(s.seals, s.quest)) {
        ctx.notify('先に二つの封印を解除しよう');
        return;
    }
    if (o.kind === 'enemy' || o.kind === 'boss')
        ctx.startBattle(o);
    return true;
}
export function action(ctx: ChapterContext, a: string) { const s = view(ctx.state); if (a.startsWith('glyph-') && ctx.modal.startsWith('seal-')) {
    const shrine = shrines.find(v => v.id === ctx.modal.slice(5))!;
    if (a.slice(6) !== shrine.answer) {
        ctx.notify('紋章が淡く揺れた。石碑の言葉を思い出そう。');
        return true;
    }
    s.seals = [...s.seals, shrine.id];
    ctx.modal = '';
    ctx.build();
    ctx.save();
    ctx.burst(shrine.x, 2, shrine.z, shrine.color, 100);
    ctx.talk('ミナ', gateOpen(s.seals, s.quest) ? dialogues.bothSeals : [shrine.name + 'の封印が解けた。もう一方の回廊へ行こう。']);
    ctx.renderUI();
    return true;
} return false; }
