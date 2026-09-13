# Chapter 5以降の追加手順

正規ソースは `app/`、GitHub Pages公開物は `docs/`。ルート直下に残る旧 `chapters/`、`systems/`、`game.ts` はコピー元にしない。

## 登録する場所

`app/chapters/catalog.ts` の1エントリに、ID、表示名、順番、前提Chapter、開始座標、章とDEBUGの動的importを登録する。

- 本編一覧・タイトルの章数・ロード・次章解放・DEBUG前提章はカタログから導出。
- `requires` は本編の前提章。灯の試練は条件にしない。
- 通常アクセスでは章・マップ・DEBUGの本体をカタログから即時ロードしない。
- `reconcileLegacyCompletion` は既存Chapter 3の古い記録補完専用。新章へ安易にコピーしない。
- Chapter 2の歴史的なクリア推定は既存 `chapter2Cleared` を維持。新章は正式なクリア状態を使う。
- ローダーはカタログの表示名・start・unlockNextを使用する。旧章内の同じ定数は回帰リスクを抑えるため残し、契約テストで一致を確認する。

## 推奨順序

1. `templates/chapter/` を `app/chapters/chapter-N/` にコピーし、ファイル末尾の `.template` を外す。`__CHAPTER_ID__` を置換する。
2. カタログに1件登録。`load:()=>import('./chapter-N/chapter-config.ts')`、`debug:()=>import('./chapter-N/debug.ts')`、順番・前提章・開始座標を設定する。
3. まず開始マップの床・当たり判定・spawnを完成させ、セーブして戻れることを確認する。
4. オブジェクト・NPC・宝箱・通常敵を追加し、章内のイベント・フラグを実装する。
5. 中ボス、最終ボス、終了イベントを順に追加する。戦闘の共通勝利処理を通し、会話や再構築の順序は章側で管理する。
6. DEBUG `names` / `apply` / `mapGates` / `placements` を実装する。
7. 前章クリア済み旧セーブ、未クリア、途中セーブ、完了後の往復、ロード失敗、PC/タッチ操作をテストする。
8. `npm test` → `npm run build` → `node scripts/check-pages.mjs`。実ブラウザで演出・音・FPSを確認して公開する。

## テンプレートの必須・任意

| 区分 | ファイル | 役割 |
|---|---|---|
| 最低限 | chapter-config.ts | Chapter契約と共通システムへの接続 |
| 最低限 | map-config.ts / maps/entry.ts | マップ一覧と遅延ロードされる描画 |
| DEBUGを使う場合 | debug.ts | プリセット、エリア進行前提、敵配置の取得 |
| 本編制作時に追加 | events.ts / state.ts / dialogue-config.ts / ui.ts | ストーリー、進行、会話、章固有画面 |
| 必要時に追加 | object-config.ts / enemy-config.ts / sprites.ts | NPC・宝箱・敵配置、敵定義、ドット絵 |
| 必要時に追加 | terrain.ts / combat.ts / audio-effects.ts / maps/scenery.ts | 地形、専用戦闘、音・演出、共通景観 |

テンプレートは開発用の床と空のフックだけで、本編や敵を実装したものではない。コピー・ロード・開始床の契約は自動テストする。Chapter 5は登録していない。

## DEBUG登録

既存章は `app/debug/presets/chapter-N.ts` に保持。新章は章フォルダの `debug.ts` でもよい。どちらもカタログのimport関数だけで登録される。

- `names`: 表示するプリセット名。
- `apply(state,name)`: 必要なflags/wins/questsを設定し、目的Map IDを返す。
- `mapGates`: Map ID → 安全に到達するためのプリセット名。
- `placements()`: `{placements: Record<MapID, 配置[]>}` を非同期取得する。章本体や全マップをimportしない。
- Map travelは不足した前提を補うだけ。完了章を巻き戻さず、既存trueフラグ・数値進行・宝箱・討伐を維持する。
- 明示的presetは進行をリセットして指定状態を再現する。travelと混同しない。
- DEBUGの小さなプリセット群はDEBUG起動時のみロード。敵配置は選択した章だけ取得する。

## Chapter 5追加で必ず触るファイル

1. 新規 `app/chapters/chapter-5/` 内のコンテンツと `debug.ts`。
2. **既存共通ファイルは `app/chapters/catalog.ts` の1箇所**。
3. 新章の回帰テスト。`tests/chapter-foundation.test.mjs` の「現在4章」の期待値も更新する。
4. ビルド生成物 `docs/`。

registry / chapter-manager / chapter-unlocks / debug.ts / debug-actions.ts / game.ts / save.tsにchapter-5専用分岐を追加する必要はない。既存Chapter 4の `unlockNext:[]` はローダーで導出され、完了時保存・旧セーブ読込でもカタログから次章を解放する。

新しい共通戦闘能力そのものが必要な場合だけ、別途共通契約を拡張する。章追加と同時に全面刷新しない。

## セーブ・ロード・描画の守るべき境界

- save versionは2のまま。キーは `lumenfall-save` / `lumenfall-v1` / `lumenfall-debug-save`。
- ロード失敗をfresh状態で代替保存しない。prepareLoad / initialLoad / installSafelyを通す。
- 完了は `completeChapter`、通常の保存はホストのsaveを通す。直接localStorageへ章独自形式を書かない。
- 試練・アクセサリー2枠は既存共通システムを使用する。
- worldへの所属とdispose、batchStatic、AdaptiveQuality、モバイル水面・影・粒子予算を維持する。
- `docs/` は最新ビルドの内容で置換する。GitHubのドラッグによる追加だけでは不要になった旧チャンクは削除されない。
- 手動Actions「Rebuild Pages from app」は現在のappをテスト・ビルドする。旧ルートソースの上書きは行わない。
