import {placeObjects} from '../object-config.ts';
import * as T from 'three';
import type {ChapterContext} from '../../types.ts';
import {view} from '../state.ts';
import {dungeonWalls,sealedGate,shrines,gateOpen,dungeonWalkable} from '../dungeon.ts';
export function build(ctx: ChapterContext) {
    const s = view(ctx.state);
    const night = s.area === 2;
    ctx.scene.background = new T.Color(night ? '#253e4d' : s.area === 1 ? '#8fa7ac' : '#9ba9a3');
    ctx.scene.fog = new T.FogExp2(night ? '#395b64' : s.area === 1 ? '#9caeb0' : '#a0aaa3', night ? .025 : .022);
    ctx.ambient.intensity = night ? 1.85 : 1.7;
    ctx.ambient.groundColor.set(night ? '#63777e' : '#384538');
    ctx.sun.color.set(night ? '#8dcde5' : '#ffcd88');
    ctx.sun.intensity = night ? 2.5 : 3.5;
    ctx.scene.userData.fillLift = night ? 1.16 : 1;
    const riverX = s.area === 0 ? -6 : s.area === 1 ? -11 : 21, riverW = s.area === 0 ? 3.3 : s.area === 1 ? 5 : 4;
    const leftEdge = riverX - riverW / 2, rightEdge = riverX + riverW / 2;
    ctx.box((-24 + leftEdge) / 2, -1.1, 0, leftEdge + 24, 2, 48, night ? ctx.mat('#294942') : ctx.mats.ground);
    ctx.box((rightEdge + 24) / 2, -1.1, 0, 24 - rightEdge, 2, 48, night ? ctx.mat('#294942') : ctx.mats.ground);
    ctx.box(0, -2.8, 0, 49, 2.1, 49, ctx.mats.dark);
    ctx.water(-11, 0, 5, 47);
    ctx.blocks.push({ x: -11, z: 0, w: 5, d: 48 });
    for (let i = 0; i < 20; i++) {
        const x = 6 + i * .65;
        ctx.box(x, -.45 + i * .065, 0, .7, .7 + i * .13, 46, ctx.mats.ground);
    }
    for (let i = 0; i < 45; i++) {
        const z = 22 - i;
        ctx.box(Math.sin(z * .13) * 2, .035, z, 3.3, .06, 1.1, ctx.mats.path);
    }
    for (let i = 0; i < 38; i++) {
        let x = ctx.rand(i + 44) * 42 - 21, z = ctx.rand(i + 83) * 44 - 22;
        if (Math.abs(x) > 6 && Math.abs(x + 11) > 3)
            ctx.tree(x, z, .65 + ctx.rand(i) * .7);
    }
    for (let i = 0; i < 12; i++) {
        const x = 10 + ctx.rand(i) * 10, z = ctx.rand(i + 99) * 30 - 15;
        ctx.box(x, ctx.height(x, z) + .5, z, 1.5, 1.4, 1.6, ctx.mats.stone).rotation.y = i;
    }
    placeObjects(ctx);
    ctx.exitMarker(0, -21, '星眠りの遺跡 →');
    ctx.torch(-2, -18);
    ctx.torch(2, -18);
}
