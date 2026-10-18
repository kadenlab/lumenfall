# Chapter 5 Phase 1 QA

Baseline main: e10e93e3ce27f92bd94ceb16b7eac986c5150dee
Branch: feature/chapter-5-part1
Started from fresh clone, clean working tree. No pre-existing edits. No agents/delegation used.

## Gates

- Baseline npm ci: success after network permission and clean retry. The initial sandbox fetch failed DNS; concurrent pending fetch was allowed to finish before the successful clean install. Baseline npm test: 168/168 passed; npm run build: passed.
- Gate A: chapter foundation + Editor + C5 tests: 38 passed, 0 failed. Initial metadata order/legacy trial fixture assumptions corrected before proceeding.
- Gate B: 42 passed, 0 failed. Both investigation orders, wrong puzzle operation, intermediate reload, letter replay and incomplete endpoint verified.
- Gate C: full suite 193 passed, 0 failed. Fixed existing four-chapter count expectation and DEBUG test's assumption that every chapter has a Before Boss preset. The latter now resets via Start for chapters without bosses; no story gate was changed to satisfy it.
- Gate D: npm run check: 193 passed, 0 failed; production build succeeded; asset/reference checks passed (78 assets, 79 referenced files). C5 production feature checks added; Editor remains excluded from production.

## Controller and storage

Two added tests execute the real game controller/DOM at 1280px and 390×844 (rendering stubbed). They play the whole route, using alternate investigation orders, all three normal fights, Elna/Baldo/records, wrong/correct puzzle, save/reload after step 2, all three chests, letter delivery, shop, free rest, return paths and final report. Separate tests check formal prerequisite, additive old-save migration, prior chapters/equipment/trials, reachability with collision, enemy IDs/balance, reward idempotency, DEBUG/Editor and no normal completion/Chapter 6.

## Browser verification

Local Vite development server, in-app Chromium/WebGL (software:false); PC default 1280×720 and viewport 390×844. Initial sandbox localhost server timed out; permission-approved local server on 5174 succeeded.

- PC: road exploration and actual turn-based encounter; starfire commands (no Instant Win), then continued at mobile size.
- Mobile: starfire victory, first-victory event dialogue, guided walking, city exit, lower-city load, Elna dialogue, save/reload, and all five map renders through DEBUG travel.
- DEBUG lower-city sample: 59 FPS, 75 draw calls, 3042 triangles. This is one desktop GPU sample at mobile viewport, not an iPhone benchmark.
- Browser console error log after map checks: 0 errors.
- Real iPhone/Safari and touch hardware: NOT tested. Device emulation is not device verification. Full route across both investigation orders is automated controller coverage, not a claim of a complete manual browser playthrough.

## Known notes

- npm ci reports four pre-existing high-severity dependency advisories. No dependency versions were changed in this content task.
- Existing Three.js production chunk remains >500 kB (543.55 kB); build warning only.
- Phase 1 intentionally ends without completing the chapter. Old tower/boss/heat mechanic belong to Phase 2.
- No known functional blocker after the passing regression run. Mobile hardware performance and Safari visual behavior remain review items.
- app/game.ts and app/systems/save.ts have no diff. No package-lock changes. Generated docs/ are rebuilt locally; never pushed/deployed.

Verdict: PASS WITH NOTES — can hand off to Phase 2; real-device iPhone verification and existing dependency advisories remain outstanding.

Editor browser verification: MAP 0–4 loaded successfully with placement counts 5 / 11 / 4 / 10 / 6. Console errors: 0. Test logs are archived under docs-dev/qa/chapter5/.
