# 配布ファイル

- lumenfall-optimized.zip：完全版。解凍直下がリポジトリルートです。通常はこちらで更新してください。
- lumenfall-changed-files.zip：以前の lumenfall-github.zip に対する追加・変更ファイル。取りこぼしを防ぐため公開用docsは一式含めています。古いハッシュ名のJS/CSSが残っても新indexからは参照しません。

どちらも最新版のビルド済みdocs、package-lock.jsonを含みます。node_modules、.git、キャッシュ、検証専用ページは含みません。既存のCNAMEや独自設定は保持してください。

主要変更：app/game.ts、app/performance.ts、app/dungeon.ts、app/chapters/、app/systems/、tests/chapters.test.mjs、tests/performance.test.mjs、package.json、package-lock.json、scripts/build.mjs、README.md、docs-dev/、docs/。

開発元のホスト用app/page.tsx、tsconfig.json、scripts/build-static.mjs、scripts/export-github.mjsも非同期起動と配布生成に対応しています。GitHub配布版はstandaloneを入口にするため、ホスト固有のファイルは不要です。

章の追加手順はCHAPTERS.md、最適化の詳細と確認限界はOPTIMIZATION.md、実プレイ記録はQA.mdを参照してください。
