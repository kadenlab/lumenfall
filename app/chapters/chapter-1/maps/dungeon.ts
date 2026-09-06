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
    ctx.water(21, 0, 4, 47);
    ctx.blocks.push({ x: 21, z: 0, w: 4, d: 48 });
    const floor = ctx.mat('#526561'), wall = ctx.mat('#4e6463'), cap = ctx.mat('#81918a');
    ctx.box(0, -.02, 5, 33, .12, 31, floor);
    for (let i = 0; i < 19; i++) {
        const z = -7 - i * .7;
        ctx.box(0, (i * .7) * .11 - .13, z, 32, .25, 1, ctx.mats.stone);
    }
    for (const b of dungeonWalls) {
        const y = ctx.height(b.x, b.z);
        ctx.box(b.x, y + .7, b.z, b.w, 1.4, b.d, wall);
        ctx.box(b.x, y + 1.46, b.z, b.w + .12, .12, b.d + .12, cap);
        ctx.blocks.push(b);
        const length = Math.max(b.w, b.d);
        for (let i = 0; i < Math.floor(length / 2.5); i++) {
            const along = -length / 2 + (i + .5) * 2.5;
            ctx.box(b.x + (b.w > b.d ? along : 0), y + .65, b.z + (b.d > b.w ? along : 0), b.w > b.d ? .08 : b.w + .03, 1.2, b.d > b.w ? .08 : b.d + .03, ctx.mats.dark);
        }
    }
    for (let i = 0; i < 12; i++) {
        ctx.box(0, .06, 18 - i * 2, 2.4, .09, 1.4, ctx.mats.dark);
    }
    for (const x of [-10, 10])
        for (let i = 0; i < 9; i++)
            ctx.box(x, .07, 15 - i * 2, 1.8, .08, 1.3, ctx.mats.stone);
    for (let i = 0; i < 24; i++) {
        const x = (i % 2 ? -1 : 1) * (18.5 + ctx.rand(i) * 1.2), z = ctx.rand(i + 77) * 42 - 21;
        ctx.tree(x, z, .8 + ctx.rand(i) * .4);
    }
    for (const x of [-3, 3]) {
        ctx.cyl(x, 2.2, -8, .5, 4.4, ctx.mats.stone);
        ctx.box(x, 4.5, -8, 1.4, .35, 1.4, cap);
        ctx.torch(x, 13);
    }
    ctx.box(0, 4.5, -8, 7, .45, 1.2, cap);
    const open = gateOpen(s.seals, s.quest);
    if (!open) {
        ctx.blocks.push(sealedGate);
        for (let i = -2; i <= 2; i++)
            ctx.box(i, .4 + 1.65, -8, .18, 3.3, .2, new T.MeshStandardMaterial({ color: '#addaf1', emissive: '#539ddc', emissiveIntensity: 1.2 }));
        ctx.box(0, 1.8, -8, 5.5, 3.4, .12, new T.MeshStandardMaterial({ color: '#6b9fc6', emissive: '#3e82ad', emissiveIntensity: .4, transparent: true, opacity: .28 }));
        ctx.light(0, 3, -7, '#8dcaff', 15);
    }
    ctx.addObj('gate', open ? '開かれた双灯の扉' : `双灯の扉（封印 ${s.seals.length}/2）`, 0, -5.7, 'gate');
    for (const shrine of shrines) {
        const done = s.seals.includes(shrine.id);
        ctx.cyl(shrine.x, .35, shrine.z, 1.45, .7, ctx.mats.stone, 12);
        const ring = new T.Mesh(new T.TorusGeometry(1.15, .065, 8, 48), new T.MeshStandardMaterial({ color: done ? '#abffe1' : shrine.color, emissive: done ? '#6cffc2' : shrine.color, emissiveIntensity: done ? 2 : .7 }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(shrine.x, .73, shrine.z);
        ctx.world.add(ring);
        const crystal = new T.Mesh(new T.OctahedronGeometry(.5), new T.MeshStandardMaterial({ color: shrine.color, emissive: shrine.color, emissiveIntensity: done ? 2.5 : .6 }));
        crystal.position.set(shrine.x, 1.65, shrine.z);
        ctx.world.add(crystal);
        ctx.light(shrine.x, 2, shrine.z, shrine.color, done ? 14 : 5);
        ctx.addObj('seal', shrine.name + (done ? '（解放済み）' : ''), shrine.x, shrine.z, shrine.id);
        if (!s.wins.includes(shrine.guardian)) {
            const e = ctx.sprite('wolf', shrine.gx, shrine.gz, 2.6);
            e.material.color.set(shrine.color);
            ctx.addObj('enemy', shrine.enemy, shrine.gx, shrine.gz, shrine.guardian).mesh = e;
        }
        ctx.torch(shrine.x, 6);
    }
    ctx.box(2, .8, 16, 1.3, 1.5, .4, ctx.mats.stone);
    const spring = ctx.cyl(2, .65, -10.5, .8, 1.3, new T.MeshStandardMaterial({ color: '#9bffe0', emissive: '#53cfa9', emissiveIntensity: 1.4 }));
    ctx.light(2, 1, -10.5, '#9bffe0', 8);
    for (const x of [-4, 4]) {
        for (const z of [-13, -18]) {
            ctx.cyl(x, ctx.height(x, z) + 2, z, .5, 4, ctx.mats.stone);
            ctx.box(x, ctx.height(x, z) + 4, z, 1.3, .4, 1.3, ctx.mats.stone);
            ctx.torch(x, z + 1);
        }
    }
    ctx.box(0, 5.1, -18, 9, .6, 1.1, ctx.mats.stone);
    ctx.cyl(0, 1.6, -16, 3.6, .45, ctx.mats.stone, 24);
    const altar = new T.Mesh(new T.TorusGeometry(2, .075, 8, 64), new T.MeshStandardMaterial({ color: '#8df7e1', emissive: '#53dccc', emissiveIntensity: 3 }));
    altar.position.set(0, 1.9, -16);
    altar.rotation.x = -Math.PI / 2;
    ctx.world.add(altar);
    ctx.light(0, 4, -16, '#60ffe0', 22);
    const boss = ctx.sprite('boss', 0, -16, 5);
    if (s.quest < 3 && open)
        ctx.addObj('boss', '虚ろの灯守 ヴェルグ', 0, -16, 'boss').mesh = boss;
    else
        boss.visible = false;
placeObjects(ctx);
}
