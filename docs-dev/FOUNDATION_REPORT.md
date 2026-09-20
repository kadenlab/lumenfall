> 過去の実装記録です。現在の開発・build・CI手順は [README](../README.md) を参照してください。旧assetsの手動削除は現行buildでは不要です。

# Chapter追加基盤の小規模整備結果

基準: main `18e07b303b50ac638907c7a9bdc3f6f1a27e8f2c`。単一エージェントで実施。Chapter 5本編は未追加。

## 1. 基盤改修

軽量catalogにID・表示名・順番・前提・開始地点・動的import・DEBUG登録を集約。解放、前提章列、次章、タイトル章数を導出する。既存イベント、敵、戦闘、描画、入力、セーブ形式は全面改修していない。

## 2. 変更ファイル

| ファイル | 変更 |
|---|---|
| app/chapters/catalog.ts | 新規メタデータ、契約検証、前提・次章の導出 |
| app/chapters/registry.ts | カタログ参照と遅延ロード、表示名・開始地点・次章反映 |
| app/systems/chapter-unlocks.ts | 共通解放判定。既存Chapter 2の旧セーブ判定を維持 |
| app/systems/chapter-manager.ts | 個別章条件を共通判定へ置換 |
| app/debug/debug-actions.ts | カタログからDEBUG登録・前提・Map gateを取得 |
| app/debug/debug.ts | 敵配置ローダーとChapter 1特殊配置の分岐を章定義へ移動 |
| app/debug/presets/chapter-1.ts〜chapter-4.ts | 既存プリセットを維持し、Map gateと配置取得を追加 |
| app/game.ts | タイトルの固定「1–4」表記だけをカタログ参照に変更 |
| scripts/build.mjs | 古い生成チャンクが残らないよう生成assetsを清掃 |
| .github/workflows/repair-chapter3-pages.yml | 危険な旧ソース上書きを削除。手動実行でappをテスト・ビルド |
| tests/chapter-foundation.test.mjs | 新規17件 |
| templates/chapter/*.template / maps/entry.ts.template | コピー用の最低限4ファイル |
| docs-dev/CHAPTER_DEVELOPMENT.md | 手順・必須/任意・保守境界 |
| docs-dev/FOUNDATION_REPORT.md | 本報告 |
| docs/index.html / docs/assets/* | 正式ビルドから再生成、不要旧チャンク削除 |

package.json / package-lock.json / セーブversionとキーは変更なし。削除されたdocs/assetsは旧ビルド生成物。ソースや公開に必要な現行ファイルはZIPへ含める。

## 3–4. 新章追加フロー・Chapter 5必須変更

テンプレートを章フォルダへコピー → カタログ1件 → Map/イベント/戦闘 → 章内DEBUG定義 → 新章テスト → 全回帰・ビルド・実ブラウザ確認。

必須: 新しい `app/chapters/chapter-5/`、既存 `app/chapters/catalog.ts`、新章テストと現在章数のテスト期待値、生成docs。DEBUG定義は新章フォルダに置けるため、共通debugファイルの編集不要。具体的な作業はCHAPTER_DEVELOPMENT.mdを参照。

## 5. 削減した章固有分岐

- Chapter managerのChapter 3/4専用ゲート。
- unlock migrationのChapter 3/4専用追加・削除。
- DEBUG前提章の4段階ternary。
- DEBUG Clearedの次章ternary。
- DEBUG Map travelの4章分のMap→preset分岐。
- DEBUG敵配置の4章分のloader登録とChapter 1特殊配置分岐。
- game.tsの固定章数表示。

Chapter 2の歴史的クリア推定と、試練がChapter 2を前提とする例外は残す。Chapter 5以降では増えない。Chapter 3の旧データ補正はmetadataに明記し、他章の記録を不要に書き換えない。

## 6. DEBUG追加

カタログのdebug importから `names/apply/mapGates/placements` を提供する。既存4章のプリセット名と効果は変更なし。Map travelはClearedを維持し、preset指定時のみ指定状態を再現する。

`?debug=1` 有効、`?debug=0` 無効。既存localStorage設定も維持。通常起動ではDEBUG本体をロード・表示しない。

## 7. セーブ互換

version 2、通常 `lumenfall-save`、旧 `lumenfall-v1`、DEBUG `lumenfall-debug-save` を維持。旧セーブ移行、通常/DEBUG分離、途中/完了セーブ、装備・2枠アクセサリー・試練記録の回帰が成功。動的import失敗・map build失敗でも通常セーブがfreshで上書きされない回帰も成功。

## 8–9. 回帰結果

Chapter 1〜4のロード、開始地点、進行、セーブ/再読込、DEBUGプリセット・Map travelの完了状態保持を確認。Chapter 4は既存の実ゲームコントローラーによる開始〜クリア・再読込テストも成功。Chapter 3エンディング遷移と新規Chapter 1開始を維持。

全5試練のルール、敵消去・補充、第四試練難易度、報酬、2枠装備と効果の既存回帰が成功。

PC幅/スマホ幅のjsdom操作テストで、キーボード、タッチスティックを離した際の停止、UI、戦闘・復帰・装備を確認。これは描画/音声をスタブ化したテストであり、実ブラウザのWebGL描画・実機FPS・音の確認ではない。

## 10. npm test

変更前105件: 成功105 / 失敗0。
変更後122件: 成功122 / 失敗0 / skip0。
既存105件を削除せず、新規17件を追加。

新規テスト: catalog順序・前提、未登録の将来5〜10契約、重複/不正前提拒否、3組の直列解放、4章のmetadata/DEBUG一致、4章の完了Map travel/save/reload、遅延import境界、Actions巻き戻し防止、テンプレート実ロード。

## 11–12. build / docs

`npm run build` 成功。`node scripts/check-pages.mjs` 成功。
ビルド済みdocsをZIPへ同梱。Three.js約544KBのチャンクに対する500KB警告は残る。コンテンツの遅延import、batchStatic、dispose、AdaptiveQuality等は維持し、描画設定は変更していない。DEBUG起動時だけ小さな各章presetを読み、敵配置は必要な章だけ取得する。

## 13. 今後肥大化しうる箇所

- 各章のevents内の報酬・休憩・宝箱処理。既存では保存や会話、描画更新の順序が異なるため今回抽出しなかった。
- Chapter 1/2の古い進行アダプターと旧セーブ互換。
- 共通game.tsのUI/戦闘フック。新章固有のルールは章のcombat/eventsへ置く。
- Chapter選択の縦長UIとDEBUG起動時の小さなpreset群。章数が増えた時点で実測して調整する。
- 未使用のルート直下旧ソース。今回削除せず、appへのコピーだけ禁止した。

## 14. Chapter 5開始前の残課題

自動回帰とビルドで判明した進行阻害はなし。実ブラウザ/スマホ実機の描画・音・FPS確認は未実施なので、公開前の確認は必要。GitHubへのpush・本番更新は行っていない。

ZIP展開内容をリポジトリへ反映し、docsは旧assetsを含めて置換する。Pages設定はmainの/docsを継続利用。ブラウザのセーブを削除する必要はない。
