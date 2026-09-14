# Developer DEBUG v0.1

Base: `v1.4.0` / `22e89e6f909ab85c015e26fe8fd2ea1389e0fdeb`.
The release tag is unchanged. Chapter 1–3, trials, accessories and the furnace collision fix are retained.

## Enable / disable

- `?debug=1`: enable for this URL only. No persistent opt-in is written.
- `?debug=0`: explicitly disable, even if storage opt-in exists.
- Alternatively `localStorage.setItem('lumenfall-debug','1')`, then reload.
- Remove that key and reload to clear persistent opt-in.
- `Disable DEBUG` navigates to `?debug=0`.
- Normal access, without a prior explicit storage opt-in, does not create any debug DOM, timer or CSS, and does not load the debug UI/actions modules.

This is an opt-in developer tool, **not authentication**. Anyone who explicitly adds the query can enable it. There is no account or server permission system.

## Storage isolation

Ordinary saves (`lumenfall-save`, legacy `lumenfall-v1`) remain untouched.
Debug initially reads a copy of the normal save; subsequent manual and automatic saves use **`lumenfall-debug-save`**. A debug save takes precedence on later debug visits. Reset operations affect only this debug save. Existing settings are retained. `debugModified: true` is added through the existing version 2 serializer; God Mode itself is session-only.

Normal mode returns to normal progress; debug progress is intentionally not merged into the player's record. Import/export use the existing versioned save envelope. Import rejects unknown current Chapters, unsupported versions, invalid progress types and prototype keys. The next load normalizes map positions using the chapter's existing rules.

## UI

Open the folding DEBUG panel at the right. Its World section updates twice per second while expanded. It shows chapter/map, coordinates, HP/MP, level/XP, currency/consumables, walkable state, interaction radii, FPS and renderer counters. Software fallback has no GPU counters.

- World: registry-derived chapter choices (plus trials), map spawn teleport, safe coordinates.
- Player: restore HP/MP, +100/+1000 G, +1/+10 potions/ethers, +1 level, +100 XP; HUD refreshes immediately.
- God Mode: zero incoming damage in main-story fights; at least 1 HP in trials. Lamp depletion still loses the trial. This is not healing and does not bypass fourth-trial recovery restrictions.
- Progress: JSON editor for current Chapter `flags`, `quests`, `defeatedEnemies` (= wins), `bosses`, `chests`, `completed`. Read progress refreshes the editor. Set flag adds absent primitive boolean/number/string flags safely. Chapter 1 `quest` is `flags.storyStage`; `seals` are `seal:west` / `seal:east`; `springUsed` remains a flag. Chapter 2 beacons is a number, not an array.
- Battle: current map enemies, restore defeated enemies, mark normal enemy defeated, teleport near a map boss, mark boss defeated through the regular battle/victory path. Instant Win works during main-story command selection. Both boss paths award normal rewards and execute `onBossVictory`; continue the resulting dialogue normally. A Cleared preset instead stages the completed record without replaying cutscenes.
- Save: save/reload debug record, read/copy/export/import JSON, confirmed current-Chapter reset, double-confirmed all-debug reset.

Travel, inventory editing, import and flag editing require exploration/title and no active dialogue. They cannot interrupt a running combat/cutscene. God Mode is available during battle; Instant Win waits for the command prompt. Teleport rejects blocked coordinates rather than moving into walls. Boss teleport searches for a walkable point near the selected boss; choose the relevant map/preset first.

## Presets

| Chapter | Presets |
|---|---|
| 1 | Start / Before Boss / Cleared |
| 2 | Start / Bridge Open / Before Bellwarden / Before Nereis / Cleared |
| 3 | Start / Village Unlocked / Old City Unlocked / Cathedral Unlocked / Before Aurel / Cleared |

Explicit preset application asks for confirmation and replaces **only the selected Chapter's progress**; inventory, player and trial equipment are retained. It also stages necessary earlier Chapter completion in the debug copy. Map teleport adds the minimum traversability prerequisites (lamps/guardian wins etc.) without resetting that Chapter's progress. A map spawn remains the teleport destination; use Boss teleport to approach a boss.

## Files and extension

- `app/debug/gate.ts`: opt-in and isolated save adapter.
- `app/debug/debug-actions.ts`: validation, player edits, travel and save actions.
- `app/debug/debug.ts`, `debug-style.css`: panel, UI actions and disposal.
- `app/debug/presets/chapter-{1,2,3}.ts`: content-specific shortcuts.
- `app/game.ts`: gated lazy imports, debug host, storage routing, God Mode and standard victory hook.
- `tests/debug.test.mjs`: action/DOM tests; `package*.json`: jsdom for tests only.
- `.github/workflows/repair-chapter3-pages.yml`: manual build from canonical `app/`; removed obsolete root-to-app copying.
- `docs/`: latest build; `README.md`, this guide.

New Chapters in `chapterCatalog` automatically appear in Go. A future pack requiring special initialize/gating prerequisites needs its own debug preset adapter. Edit canonical `app/`; leftover root-level source files from historical uploads are not build inputs.

## Validation and limits

69 tests pass, including all 59 baseline tests and 10 new debug tests. DOM tests actually click chapter/map teleport, healing, supplies, flag application, Save and both Reset actions. Tests also cover query override, no debug DOM when off, migration/normal-save isolation, all preset spawns, God Mode, and invalid import.

`npm test` and `npm run build` succeed. Debug JS/CSS are separate lazy chunks. Existing >500 kB main-bundle advisory remains; no new runtime test libraries are shipped to players.

Graphical browser play, GPU performance and deployed `?debug=1` have not been verified for this update. The test browser previously rejected localhost; the public site remains unchanged until upload. DOM tests are not a substitute for rendered browser testing. After uploading, check normal URL (no DEBUG) and query URL (DEBUG), then Before Aurel → Boss teleport → normal interaction / Instant Win → complete the dialogues. Also test `?debug=0` returns to the ordinary save.

Not included: 3D collider overlays, trial Instant Win, normal-save overwriting, account-based developer authentication, Chapter 4 content. Colliders may be added later without changing gameplay collision rules.
