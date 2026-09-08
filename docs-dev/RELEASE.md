# 灯の試練 表示・難易度修正版（1.3.1）

配布物：`lumenfall-trials-adjusted.zip`。Chapter 1・2・灯の試練を収録。Chapter 3は含まない。展開した中身をGitHubリポジトリ直下に上書きし、Pagesのmain /docs設定を維持する。セーブ削除不要。

変更ファイル：app/game.ts、app/globals.css、app/trials/chapter.ts・presentation.ts・rules.ts・ui.ts、tests/trials.test.mjs、scripts/export-github.mjs、説明書と最新docs/。

# 灯の試練 Ver.1 公開更新

最新配布物は `lumenfall-trials.zip` です。Chapter 1・2と灯の試練をすべて含みます。展開した中身をリポジトリ直下へ上書きし、Pagesのmain /docs設定を維持してください。

更新内容は [TRIALS.md](TRIALS.md)、今回の検証記録は [TRIALS-QA.md](TRIALS-QA.md) を参照してください。

以下はChapter 2公開時の記録です。

---

# Chapter 2配布

`lumenfall-chapter2.zip` はChapter 1と2を含む完全版です。展開直下がリポジトリルートになります。最新のビルド済みdocs、ソース、テスト、package-lock.jsonを含みます。node_modules、.git、キャッシュ、検証専用ページは含みません。

GitHubでは展開した中身を既存ルートへ上書きし、コミットしてください。Pagesのmain /docs設定はそのままです。既存CNAMEなど独自設定は残してください。

追加内容はCHAPTER-2.md、検証結果はCHAPTER-2-QA.mdを参照してください。QA.mdとOPTIMIZATION.mdは前回の最適化時の記録です。
