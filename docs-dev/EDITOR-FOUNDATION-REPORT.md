# 安定開発基盤 / Editor v0.1 検証報告

作業ブランチ: `foundation/editor-v0.1`。ユーザー承認により作業ブランチへローカルコミット。Push / mainへの反映は行っていません。サブエージェント・依存関係更新・本編の大規模改修なし。

## 1. 開始main SHA

取得したmain: `b878841e08178e064ef1483a800869b2e0122fa1`。作業開始時のチェックアウトはclean。添付指示に記載された旧SHAではなく、取得した最新版を基準にしました。

## 2. 変更前テスト

`npm ci`成功後、`npm test`: 総数145 / 成功145 / 失敗0 / skip0。

## 3. 変更前build

`npm run build`成功。`node scripts/check-pages.mjs`成功。Three.jsの500kB超警告は変更前から存在します。

## 4. 変更前docs/assets数

67ファイル。

## 5. 掃除したもの

READMEを現在の開発手順へ整理。旧READMEは`README-HISTORY.md`へ保存。古い修復用workflowを検証専用CIへ置換。過去の基盤・スマホUI報告には旧手順であることを明記し、DEBUG文書のworkflow参照を更新しました。

## 6. 削除しなかったもの・理由

旧assets削除スクリプトと一覧JSONは過去ZIPの記録から参照されるため残しました。現在のpackage scripts / CI /標準手順からは使いません。ルート直下等にある旧ソース・成果物は全利用先を断定できないため削除していません。既存`check-pages.mjs`とChapterテンプレートも互換・再利用のため維持しました。

## 7. GitHub Actions変更

`.github/workflows/ci.yml`: push / pull_request、contents: read、Node 22.18.0、npm ci → npm run check。旧`repair-chapter3-pages.yml`は削除。CIからのcommit/pushはありません。Pagesのmain/docs方式は変更していません。GitHub上での新CI実行は未確認です（未Push）。

## 8. VS Code追加内容

tasks.json: Dev / Test / Build / Preview / Check。Dev・Previewはbackgroundとready判定付き。launch.json: 標準JavaScript DebuggerによるPlay / DEBUG / Editor、preLaunchTaskはDev。settings.jsonはformatOnSave無効等の最小設定。extensions.jsonは追加拡張不要。設定の整合性を自動テストしました。

Windows上のnpmコマンド、5173のDev、4173のPreviewは起動確認済み。VS Code画面でのタスク開始・終了・F5は未確認です。操作に使用するcomputer-useスキルの必読guidanceには「Do not run Windows terminal commands via UI automation directly or indirectly.」という制約があり、UI経由のタスク起動は避けました。

## 9. 日常開発手順

1. GitHub Desktop → Repository → Open in Visual Studio Code。
2. 初回のみ「ターミナル → 新しいターミナル」で`npm ci`。
3. 「ターミナル → タスクの実行 → Lumenfall: Dev」。
4. 「実行とデバッグ」でPlay / DEBUG / Editorを選びF5。
5. 編集後「ターミナル → タスクの実行 → Lumenfall: Check」。
6. Previewで公開物を確認。「ターミナル → タスクの終了」でサーバーを停止。
7. GitHub Desktopで作業ブランチの差分を確認してCommit。レビュー後にPushとmain反映を判断。

## 10. npm run check内容

テスト → build → check-project。index・JS/CSS・遅延chunkの参照、公開必須ファイル、孤立した旧assets、Chapter 1〜4と試練・調査の複数識別子、Editorの混入を確認します。独自bundlerや完全なJavaScript解析器は作っていません。

## 11. Chapter拡張基盤変更

既存catalogが解放・save・メニュー・DEBUGを駆動できるため、追加の抽象化は行っていません。5〜10の仮想metadata検証と既存テンプレート検証を維持し、Chapter追加手順を文書化しました。Chapter 5本編は未実装です。

## 12. Chapter 5で変更するファイル

追加: `app/chapters/chapter-5/chapter-config.ts`、`map-config.ts`、`maps/entry.ts`、`debug.ts`。配置が必要になったら`object-config.ts`、必要な敵・イベント定義。更新: `app/chapters/catalog.ts`。追加: Chapter 5のテスト・説明文書。再生成: docs/。通常はgame.ts / save.ts / メニューへのChapter ID手書き追加は不要です。

## 13. 横展開基盤

`SIDE-CONTENT-DEVELOPMENT.md`に解放条件、専用save namespace、通常進行非干渉、DEBUG、報酬二重取得防止、migrationの契約を記載。試練と調査を統合する新frameworkは作っていません。

## 14. Editorアーキテクチャ

`app/editor/`のindex.ts / editor.ts / editor-style.css / model.ts / scene-adapter.tsの5ファイル。standalone/main.tsからDEVかつeditor=1の場合だけ動的import。独立したThree.js rendererとOrbitControls / TransformControlsを利用。sceneryOnlyの既存map buildとcatalogの配置定義を使用し、ゲーム本体は変更していません。

## 15. Editorでできること

Chapter・Map切替、Scene、Hierarchy、選択、Inspectorの名前・X/Z・radius編集、XZ Moveギズモ、GridとSnap、blocks・radius表示、Draft NPC/Enemy/Chest/Propの追加削除、専用Draft保存復元、JSON / TypeScript表示・Copy・Download、DEBUG座標payloadのCopy。

## 16. Editorでできないこと

ゲームイベント・敵・報酬の自動定義、ソース上書き、Git操作、通常save編集、自動Play/Stop、Undo履歴、回転・Scale編集、地形・ライト編集はありません。配置は色付きマーカーで、木・家・水・光源等の表示は簡略化しています。移動可否の全面ヒートマップはありません。保存できるDraftは一度に1マップです。

## 17. Editorの通常buildへの影響

Editorコード・CSS・controls用chunkは公開物に含まれません。Previewで`?editor=1`を付けても通常タイトル・通常ゲームが起動し、Editorは起動しないことを確認しました。再生成した公開70ファイルは、改行形式を除き開始時HEADと一致しました。

## 18. Editor save / draft分離

Editorは`lumenfall-editor-draft`だけを読み書きします。通常の`lumenfall-save`と`lumenfall-debug-save`を変更しないこと、壊れたDraftの拒否、座標の不正値拒否を自動テスト済み。ブラウザではSave →別マップへ移動→Loadによる座標・名前の復元とClearを確認しました。

## 19. Play From Here

許容された縮小案の **Copy DEBUG teleport payload** を実装。Chapter / Map / X / Zを既存DEBUGのWorld欄へ手動で入力する方式です。新タブの自動一時プレイは未実装です。ゲーム側の起動・save経路へ追加処理を入れていません。

## 20. Export JSON例

```json
{"version":1,"chapterId":"chapter-4","mapId":2,"objects":[{"id":"draft-prop-1","kind":"prop","name":"Draft prop","x":0,"z":0,"source":"draft","radius":2.3}]}
```

実際は既存配置と必要なsprite等のmetadataも含みます。mesh・helperは出力しません。

## 21. Export TypeScript例

```ts
export const playerStart = {area:2,x:0,z:17};
export const worldObjects = [
 {id:'draft-prop-1',kind:'prop',name:'Draft prop',x:0,z:0,r:2.3}
];
export const placementMetadata = [{id:'draft-prop-1',needsDefinition:true}];
```

Chapter固有のPlacementへ手動で合わせるsnippetです。宝箱と他の対象が同じgameIdを使う場合はkindも照合します。

## 22. Chapter 1〜4回帰

既存テスト全維持、Chapterごとのsave・解放・配置・戦闘等のテスト成功。Editorの全マップ読み込み成功。実操作はChapter 1で灰羽の獣の防御→星火→勝利・探索復帰、Chapter 4で潮噛みの回復・防御→DEBUG Instant Win・探索復帰を確認。Chapter 2・3の本編通しプレイは今回未実施です。

## 23. 灯の試練回帰

灯守を開始し「灯を守る」で1ターン進行、灯100→98、HP減少、撤退・本編HP復帰を確認。試練の状態・報酬・アクセサリーは自動テストで確認。全5試練の実操作クリアは未実施です。

## 24. 灯路異変調査回帰

風に偏る灯で案内→残風の灰羽戦、星火、HP960→873・予告更新、DEBUG Instant Winによる勝利経路を確認。途中・全解消saveや報酬の回帰は自動テスト済み。全調査の手動クリアは未実施です。

## 25. スマホ結果

ブラウザの390×844・320×568でChapter 4通常戦闘を確認。敵HP、味方HP/MP、全6コマンド、キャラクターが表示され、探索UIは非表示。回復・防御の操作成功。実機タッチ、iPhone safe area、各端末ブラウザは未確認です。

## 26. タブレット結果

768×1024で主人公と仲間が左端で切れず、敵・HP・全コマンドが見えることを確認。既存PC系レイアウトなので中央メッセージの一部が右下コマンドに隠れる表示は残ります。今回のEditor作業では戦闘UIを変更していません。

## 27. Editor実操作結果

1280×800でChapter / Map切替、Hierarchy選択、Sceneの敵マーカー選択、名前・X編集、MoveギズモのX=5→8、1.0 Snap、Orbit・Zoom、Collision / Grid ON/OFF、Draft追加削除、保存復元、JSON / TSのCopyと出力内容、DEBUG payload Copyを確認しました。Chapter 1宝箱の取得補完後の表示も確認済み。ブラウザconsoleに確認した範囲のerrorはありません。

Pan、Downloadの実ファイル保存、Z軸ギズモ、既存配置削除確認ダイアログの受諾・取消は実操作未確認です（削除を試す操作がブラウザ操作ツール側でタイムアウトし、対象は残りました）。未承認の既存削除拒否と承認後削除はモデルテストで確認済み。Snap 0.25 / 0.5 / 1 / OFFと座標・Export内容は自動テストでも確認しました。

## 28. 変更後 npm test

総数168 / 成功168 / 失敗0 / skip0。既存145件を維持し、新規23件を追加。save回帰10、Editor11、build参照1、VS Code設定整合1。

## 29. npm run build

成功。Three.jsの既存500kB超警告のみ。EditorはDEV分岐から除去されます。

## 30. npm run check

成功。168件の再テスト・build・公開参照検証まで完了。`Project checks OK: { assets: 67, files: 68 }`。

## 31. 変更後docs/assets数

67ファイル。孤立した旧assetsなし。公開物は再生成して内容一致を検証し、改行だけの差分は元に戻しました。そのためdocs/に実質的な変更はありません。

## 32. productionサイズ比較

| 対象 | 変更前 bytes | 変更後 bytes | 増減 |
|---|---:|---:|---:|
| index-Dh8CTAbN.js | 75,798 | 75,798 | 0 |
| index-CvvmK3nJ.css | 17,492 | 17,492 | 0 |
| three.module-BkYRkxE7.js | 543,558 | 543,558 | 0 |
| assets数 | 67 | 67 | 0 |

## 33. 既知の問題・範囲

自動Playは未実装。Editor背景の簡略表示、1マップDraft、Undoなしはv0.1の範囲です。Pan等の未確認操作、VS Codeの実画面起動、新CIのGitHub上の実行、実機ブラウザは未確認。768pxの既存メッセージ重なりとThree.jsサイズ警告は残っています。依存追加・本編コード・save形式・戦闘処理の変更はありません。

## 34. GitHub反映前の実機確認

VS CodeでDevタスク→F5のPlay / DEBUG / Editor起動、Previewとタスク終了。EditorのPan・Z軸移動・Download・既存配置削除確認。実機スマホのタッチ・safe area・小画面戦闘。普段のブラウザで既存save・装備2枠・試練と調査の代表操作。GitHub Desktopでは`foundation/editor-v0.1`の変更を確認し、意図しないファイルがないことを確認してCommitしてください。今回こちらからPushはしていません。
