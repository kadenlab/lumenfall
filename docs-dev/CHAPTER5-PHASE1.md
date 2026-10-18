# Chapter 5 Phase 1 — 灰に沈む灯

## Scope and integration

MAP 0–4 only. Three.js / HD-2D and existing turn-based commands are retained.
`app/game.ts`, `app/systems/save.ts`, equipment/accessory rules and save version 2 are unchanged.
Catalog requires formal Chapter 4 completion (completedChapters or chapter progress completed); defeating Ignas alone is insufficient.
No Chapter 6 registration/unlock, boss, new equipment, or empty MAP 5 is added.

| MAP | Content |
|---|---|
| 0 灰降りの街道 | Stone road, ash, broken cart, refugees, chimney/furnace silhouettes; C4 recap; mandatory first victory before city exit and one-time shader light pulse |
| 1 グランヴェル下層区 | Elna, Touma and his small lamp, residents, Sara; houses/heat pipes/workshop; free full HP/MP rest; existing 15G herb and 20G ether shop; one chest |
| 2 上層区・炉政庁 | Gold lamps, orderly paving/pipes, administrative building; Baldo's responsibility and objections; permanent over-limit operation/diverted-flow record |
| 3 地下送灯路 | Pipes, blue conduits, gears, bridge; maintenance hint; cooling/distribution/power puzzle; wolf; worker letter; one chest |
| 4 廃灰坑道 | Leaning supports, rails, abandoned machinery, ash, pale lamps and sealed depth; moth; distributed-lamp record; one chest; return via MAP 3 |

Connections: 0 ↔ 1 ↔ 2, 1 ↔ 3 ↔ 4. The city exit from 0 requires `ash-eater` victory. Elna opens investigations 2/3; restored passage opens 4. Map 4 has no exit to an unimplemented map.

## Narrative and replay

The altered flow from the ring sea may feed the great furnace. Van's purpose remains unknown.
Mine records establish that decentralized lamps can support districts, explain Touma's stable lamp, and point to the old distribution tower. Current operating records are needed before a safe switchover; merely stopping the furnace would endanger heating, water and transport.
Either office-first or mine-first works. After both records, report to Elna to save the Phase 1 endpoint. No Chapter Complete UI is invoked. NPC responses and notebook change with progress. The city remains explorable.

## Persistent Phase 2 contract

Namespace: `campaign.chapters['chapter-5']`. Keep IDs and meanings when adding MAP 5–7.

| flags | Meaning |
|---|---|
| introSeen | Road introductory dialogue completed |
| furnaceFlash | One-time post-first-victory flash presented |
| elnaMet | Investigations accepted; MAP 2/3 accessible |
| baldoMet | Initial Baldo conversation occurred; operating record readable |
| officeRecord | Operating/diverted-flow record copied permanently |
| puzzleStep | 0,1,2,3: next operation index; intermediate steps persist |
| passageRestored | Permanent passage to MAP 4; repeated device use does not reset it |
| mineRecord | Distributed-lamp facility record copied permanently |
| towerClue | Old tower location/switchover clue acquired (mine record) |
| part1Complete | BOTH records reported to Elna; Phase 2 handoff ready |
| letterFound | Worker letter found, even before request |
| debugArtificialClear | DEBUG Cleared fixture only; never set by story |

`quests['furnace-flow']`: arrival → investigate → office-record or mine-record → report → old-tower. syncQuest derives the current objective without regressing after the final report.
`quests['soot-letter']`: active / complete. Letter can be found before accepting; delivery rewards 100G + 2 herbs once. It never gates main progress.
`defeatedEnemies`: ash-eater, machine-wolf, lamp-moth. Existing victory code records them and suppresses repeat rewards.
`chests`: lower-cache (80G/2 herbs/1 ether), conduit-cache (90G/2/2), mine-cache (120G/3/2), each once.
`unlockedAreas`: existing Chapter API, plus MAP 4 recorded on puzzle completion.
Normal Phase 1 keeps `completed:false`. Phase 2 should preserve all fields and only complete Chapter 5 after its actual conclusion.

Puzzle order: cooling → distribution → power. Any incorrect input resets puzzleStep to 0 without HP/item penalty. Already-solved puzzles remain solved. Exit to lower city stays accessible throughout. Devices switch from amber to blue; an unsolved bridge barrier has collision and the exit checks the persistent gate independently.

## Combat and visuals

| Enemy | HP | ATK | EXP | G | Rules |
|---|---:|---:|---:|---:|---|
| 灰喰い | 300 | 28 | 185 | 55 | Basic attacks |
| 焼け歯の機狼 | 380 | 33 | 210 | 70 | Turn 2 wind-up (16 damage), turn 3 charge (58); UI warns before guard decision |
| 灯吸い蛾 | 320 | 29 | 195 | 60 | MP drain 3; starfire prevents drain that turn; existing resistance/gear drain mitigation applies |

Compared with C4 normal HP 255–340 / ATK 25–32. Tests use level 14 with ordinary ring sword/cloak, no trial accessories; normal sword/guard can win. Controller tests also exercise starfire, items/shop and rest. No custom battle loop replaces the game's equipment/accessory processing.

All assets use primitives and locally painted sprites. Zero Chapter 5 point lights/reflectors; static batching remains enabled. Aboveground ash uses one 48-point GPU animation. Furnace pulse uses one material shader and no delayed callbacks. Distant geometry does not cast large obstructing shadows. Editor sceneryOnly avoids gameplay objects, flash, dialogue and writes; placements and treasure metadata come from DEBUG's standard lazy adapter.

## DEBUG

Start (0), Lower City (1), Office (2), Conduit (3), Mine (4), Part 1 End (1), Cleared (1).
Cleared is an artificial DEBUG fixture to satisfy shared cleared-travel tests; only DEBUG marks completed. Ordinary Part 1 End remains incomplete. Existing DEBUG storage isolation is unchanged.

## Unimplemented by design

MAP 5 旧分灯塔 and MAP 6–7, final boss 灰燼の炉心王, furnace-heat mechanic, remaining two normal enemy types, three new equipment items, actual Chapter 5 completion and Chapter 6 unlock.
