# Lumenfall — Stable Development Baseline

Chapter 1〜4、灯の試練、灯路異変調査を維持し、VS Codeで開発するための基準です。ソースの正本は `app/`、起動口は `standalone/`、GitHub Pages公開物は `docs/` です。

## 毎日の開発

1. GitHub Desktopで `kadenlab/lumenfall` をCloneし、Repository → Open in Visual Studio Code（またはVS Codeの「フォルダーを開く」）でリポジトリ直下を開きます。
2. Node.js **22.18以上**を使い、VS Codeの「ターミナル → 新しいターミナル」で初回に `npm ci`。
3. 「ターミナル → タスクの実行 → Lumenfall: Dev」で起動。ブラウザで `http://127.0.0.1:5173/`。
4. F5 → `Lumenfall: Play` / `Lumenfall: DEBUG` / `Lumenfall: Editor` を選択。標準JavaScript Debuggerを使用します。Chromeがない場合はlaunch.jsonのtypeをpwa-msedgeに変更できます。
5. 編集後「ターミナル → タスクの実行 → Lumenfall: Check」。テスト、build、公開参照検証が続けて実行されます。
6. `Lumenfall: Preview`で `http://127.0.0.1:4173/` の公開ビルドを確認。サーバー停止は「ターミナル → タスクの終了」。F5の停止とDevタスク終了は別です。
7. GitHub Desktopでソースと `docs/` の追加・変更・削除を確認し、作業ブランチへCommit。レビュー後にPush／mainへの反映を判断します。

Devは5173、Previewは4173に固定し、使用中ならエラーにします。重複サーバーを終了して再起動してください。formatOnSaveは無効です。既存ファイルの一括整形は行いません。

```sh
npm ci
npm run dev
npm test
npm run build
npm run check
npm run preview
```

## 公開とCI

GitHub Pagesの **main /docs** 公開方式を維持します。`npm run build` は生成先を空にして作り直すため、旧assetsの手動削除は不要です。生成物の削除もコミットに含めてください。

`.github/workflows/ci.yml` はpush／pull_request時に `npm ci` と `npm run check` を実行する検証専用CIです。contents: readで、コミットやPushはしません。旧自動コミットworkflowは置き換えました。CIビルドが成功しても、ローカルで生成してコミットしたdocsだけがPages公開対象です。

## 開発ガイド

- [Chapter追加](docs-dev/CHAPTER-DEVELOPMENT.md)
- [横展開コンテンツの契約](docs-dev/SIDE-CONTENT-DEVELOPMENT.md)
- [Lumenfall Editor v0.1](docs-dev/EDITOR.md)
- [安定基盤の検証報告](docs-dev/EDITOR-FOUNDATION-REPORT.md)
- [DEBUG](docs-dev/DEBUG.md) · [Chapter 4](docs-dev/CHAPTER4.md)
- [過去の変更記録・ZIP運用](docs-dev/README-HISTORY.md)（現行手順ではありません）

## ゲーム操作・セーブ

WASD／矢印キーで移動、E／Spaceで調べる、Escでメニュー。スマホは移動スティックと案内ボタンを使用。戦闘コマンドはスマホでは下部、PCでは右下です。

通常セーブとDEBUGセーブは別キーです。記録はブラウザ・公開URLごとの保存で、別端末へ自動同期しません。Editorはローカルの `?editor=1` のみ。ソース、通常save、DEBUG saveへの書込みやGit操作は行いません。
