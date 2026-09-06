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
    ctx.water(-6, 0, 3.3, 47);
    for (const x of [-8, -4])
        ctx.box(x, .05, 0, .4, .4, 47, ctx.mats.stone);
    for (const z of [5, -8]) {
        ctx.box(-6, .1, z, 5, .28, 3, ctx.mats.wood);
        for (let j = 0; j < 10; j++)
            ctx.box(-8.3 + j * .5, .27, z, .07, .04, 3, ctx.mats.gold);
        for (const dz of [-1.45, 1.45]) {
            ctx.box(-6, .85, z + dz, 4.8, .12, .13, ctx.mats.wood);
            for (const x of [-8, -6, -4])
                ctx.box(x, .5, z + dz, .13, 1, .13, ctx.mats.wood);
        }
    }
    ctx.blocks.push({ x: -6, z: -17, w: 3.5, d: 15 }, { x: -6, z: -1.5, w: 3.5, d: 9.8 }, { x: -6, z: 15.5, w: 3.5, d: 17 });
    ctx.box(1, .012, 3, 6, .04, 30, ctx.mats.path);
    ctx.box(0, .015, 4, 26, .04, 3, ctx.mats.path);
    ctx.house(-13, -2, 5.5, 4.7, '#405f72');
    ctx.house(7, -4, 5.8, 5, '#647d6e');
    ctx.house(13, 6, 4.5, 4, '#806552');
    ctx.house(-13, 11, 5, 4, '#426e74');
    ctx.house(6, -16, 5.5, 4, '#58746a');
    ctx.cyl(0, .25, -5, 2.2, .5, ctx.mats.stone, 16);
    ctx.cyl(0, .6, -5, 1.6, .45, ctx.mats.dark, 16);
    ctx.water(0, -5, 2.4, 2.4, .84);
    ctx.cyl(0, 1.6, -5, .25, 2.5, ctx.mats.stone);
    const gem = new T.Mesh(new T.OctahedronGeometry(.5), new T.MeshStandardMaterial({ color: '#ffe1a1', emissive: '#ffb95e', emissiveIntensity: 2 }));
    gem.position.set(0, 3, -5);
    ctx.world.add(gem);
    ctx.light(0, 3, -5, '#ffcf89', 12);
    ctx.blocks.push({ x: 0, z: -5, w: 3.8, d: 3.8 });
    placeObjects(ctx);
    ctx.exitMarker(1, -20, '北門 → 琥珀の丘');
    ctx.box(1, .015, -16, 3.2, .06, 10, ctx.mats.path);
    ctx.torch(-3, 6);
    ctx.torch(3, -10);
    ctx.torch(-9, 5);
    ctx.torch(10, 3);
    for (let i = 0; i < 22; i++) {
        const x = ctx.rand(i + 4) * 43 - 21, z = ctx.rand(i + 98) * 43 - 21;
        if (Math.abs(x) > 16 || z > 16)
            ctx.tree(x, z, .8 + ctx.rand(i) * .35);
    }
}
