# Lumenfall — チャプター追加ガイド

## 今回の変更

Chapter 1（町→琥珀の丘→星眠りの遺跡→ヴェルグ→クリア）の内容を独立したコンテンツパックに移しました。Chapter 2の本編は含めていません。描画、入力、戦闘、プレイヤー、インベントリ、音声再生、UI枠は共通です。

| ファイル | 役割 |
| --- | --- |
| app/game.ts | 共通の描画・カメラ・UI・戦闘・入力接続。チャプター固有処理は契約経由で呼ぶ |
| app/systems/state.ts | 共通プレイヤー・所持品・現在位置 |
| app/systems/progression.ts | 現在章、クリア履歴、解放章、章ごとのフラグ・宝箱・クエスト・撃破・解放エリア |
| app/systems/chapter-manager.ts | 記録を保った安全な切り替え準備 |
| app/systems/save.ts | version 2保存・検証・旧保存の移行 |
| app/chapters/types.ts | Chapter / MapConfig / EnemyConfig / ChapterContext の契約 |
| app/chapters/registry.ts | 軽量なチャプター一覧と遅延読み込み |
| app/chapters/chapter-1/chapter-config.ts | Chapter 1の入口、終了、復帰、進行フック |
| app/chapters/chapter-1/map-config.ts | マップ名・ID・初期位置・個別ロード関数 |
| app/chapters/chapter-1/maps/ | town.ts・field.ts・dungeon.ts。既存の3D配置を保持 |
| app/chapters/chapter-1/object-config.ts | NPC、通常敵、出口、宝箱配置・報酬 |
| app/chapters/chapter-1/enemy-config.ts | 敵・ボスのHP、攻撃、報酬、段階変化メッセージ |
| app/chapters/chapter-1/dialogue-config.ts | 名前付き会話データ |
| app/chapters/chapter-1/quest-config.ts | メインクエスト定義 |
| app/chapters/chapter-1/events.ts | 会話・祠・泉・宝箱など固有イベント |
| app/chapters/chapter-1/dungeon.ts | 固有の壁・封印・番獣位置・当たり判定 |
| app/chapters/chapter-1/audio-effects.ts / sprites.ts | BGM音列、ボス演出の色・霧、敵ドット絵 |
| app/chapters/chapter-1/ui.ts / state.ts | 固有表示・既存ストーリー段階と汎用記録の橋渡し |

## フォルダ構成

- app/ — 共通ゲームと chapters/、systems/
- app/chapters/chapter-1/ — 上表のChapter 1の内容
- docs/ — ビルド済みGitHub Pages公開ファイル
- standalone/ — サーバー不要のブラウザ用入口
- scripts/build.mjs — GitHub配布版のビルド（docsを生成）
- tests/ — 入力・当たり判定・移行・進行・最適化のテスト
- docs-dev/ — 開発手順と検証記録

## Chapter 2を追加する場所・手順

1. `app/chapters/chapter-2/` を作り、Chapter 1の設定ファイル構成を参考にする。固有の `chapter-config.ts` は `Chapter` 型を満たす default export にする。
2. `id: 'chapter-2'`、章名、start/returnTo/respawn、次に解放する章を設定する。マップIDは**章内で一意かつ保存後は安定した整数**とする。同じ `0` でもChapter 1とは別のマップ。
3. map-config に各マップと `load: () => import('./maps/新マップ.ts')` を登録する。マップモジュールは `build(ctx)` のみ公開し、トップレベルで3Dオブジェクト・音声・テクスチャを生成しない。
4. NPC・敵・出口・宝箱を object-config に、敵の能力値とボス段階を enemy-config に、台詞を dialogue-config に追加する。Chapter 1独自の祠・壁はコピー必須ではない。独自の地形やギミックはその章の maps / events に実装する。
5. `registry.ts` の配列に `{id:'chapter-2', title:'Chapter 2 — 章名', load:()=>import('./chapter-2/chapter-config.ts')}` を1行追加する。これで共通メニューの「チャプターの記録」に登録される。未解放なら選択できない。
6. Chapter 1クリア済みセーブは既に `chapter-2` を解放済みとして持つ。Chapter 2を配布すると選択可能になる。章内イベントからは `ctx.switchChapter('chapter-2')` も利用可能。新しい章は `begin(ctx)`、再訪は保存位置から再開する。
7. `ctx.progress.flags`、`quests`、`chests`、`defeatedEnemies`、`bosses` を使う。別章とIDが重なっても記録は衝突しない。章クリア時に `ctx.finish()` を呼ぶと共通管理側がクリア・次章解放・帰還・保存を行う。
8. `npm test` → `npm run build`。実際に新章の始まりから終了、前章再訪、旧セーブのロード、スマホ操作を確認する。公開は生成された `docs/` を上書きするだけ。

設定だけで追加できるのは、既存の仕組みを使う敵・会話・NPC・宝箱などです。新しい地形表現や未実装のギミックは、その章の `build(ctx)` / イベント関数を記述します。共通エンジンに章番号の条件分岐を追加する必要はありません。タイトルのChapter Selectを追加する場合も `chapterChoices(campaign)` と `switchChapter` を再利用できます。

## セーブ互換性

保存キーは `lumenfall-save`、schema versionは2。`campaign` に現在章・解放・クリア履歴と章ごとの進行、`player` にステータスと所持品、`location` に現在位置、`playTime` に時間を保存します。既存の `lumenfall-v1` は初回ロード時にChapter 1として移行し、元のキーは変更しません。旧遺跡の無効位置は入口へ戻します。新しい未知のversionは破壊せずエラー表示します。

将来schemaを変える場合は `systems/save.ts` に順序付きの移行を追加し、versionを上げます。Chapter 1の互換処理は `chapter-1/migrate.ts` に閉じています。公開URL・ブラウザを変えるとlocalStorageは共有されません。

## メモリと描画

章と各マップはdynamic import。未訪問のマップモジュールを同時にロードしません。訪問済みJavaScriptモジュールのキャッシュはブラウザが保持しますが、各モジュールはGPUリソースを保持しません。マップ変更時にgeometry/material/texture/Reflectorを破棄、章変更時には敵spriteキャッシュも破棄します。共有のプレイヤー操作・描画品質・音声設定は引き継ぎます。非表示タブ停止、静的メッシュ統合、ライト数制限、影/川反射更新の制限を保持しています。
