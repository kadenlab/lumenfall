# Chapter 5〜10の追加

正本は `app/chapters/catalog.ts` のChapterMetadataです。現在Chapter 5は未登録・未実装です。既存のcatalog、解放、メニュー、save、DEBUG動的読込をそのまま利用します。

1. `templates/chapter/` の4ファイルを `app/chapters/chapter-5/` にコピーし、末尾 `.template` を外す。maps/フォルダーも維持する。
2. `__CHAPTER_ID__` を `chapter-5` に置換。
3. catalogに次の1件を追加（タイトルと開始地点を決める）。

```ts
{id:'chapter-5',title:'Chapter 5 — 仮題',order:5,requires:'chapter-4',
 start:{area:0,x:0,z:8},load:()=>import('./chapter-5/chapter-config.ts'),
 debug:()=>import('./chapter-5/debug.ts')}
```

4. `map-config.ts` のMapConfigにid/name/eyebrow/description/night/spawn/loadを定義。loadはマップごとの遅延import、buildはChapterContextを受け取る。
5. `object-config.ts` は配置が必要になったとき追加。`placements: Record<number, Placement[]>`、`treasures`、`place(ctx)` の既存Chapter構造に合わせる。placeは `if(ctx.sceneryOnly)return` を先頭に入れる。背景のbox/cyl/tree等はMap buildに、WorldObjectとイベント処理は分離する。
6. EnemyConfig（hp/attack/xp/gold、必要ならboss/intro）をchapter.enemiesへ登録。Enemy配置IDと一致させる。EditorのDraft Enemyを置くだけでは戦闘定義はできない。
7. `chapter-config.ts` のChapterフックを実装。イベントが増えた時だけevents.ts、固有戦闘が必要な時だけcombat.tsへ分ける。ChapterContextのsave/talk/transition/startBattle等は本編から渡される能力境界。rendererや入力内部へ直接依存しない。
8. `debug.ts` のStart／Cleared、必要なmapGates、placements()を実装する。placements()でobject-configのplacementsとtreasuresを返すと、Editorでも配置を取得できる。既存DEBUGパネルにChapter固有ifを追加しない。
9. `tests/chapter5.test.mjs` で前提解放、進行、配置、敵定義、クリア、旧saveからの移行を検証。`npm run check` を実行し、docsもコミットする。

## 通常変更するファイル

- 追加: chapter-5/chapter-config.ts、map-config.ts、maps/entry.ts、debug.ts、必要なobject-config.ts等
- 更新: app/chapters/catalog.ts
- 追加: tests/chapter5.test.mjs、Chapter説明文書
- 再生成: docs/

game.ts・save.ts・メニューへのChapter ID手書き追加は通常不要です。既存catalogテストにある「未実装Chapter 5」期待値は、Chapter 5を実際に追加するときに実装状況へ更新してください。

## Save migrationの境界

新Chapterのnamespaceを追加するだけなら既存createProgress／catalogの解放処理で扱えます。保存済みIDの変更、Quest/Boss/Chest IDの改名、既存フィールドの意味変更、開始座標の変更により旧セーブが壁内になる場合は、Chapter単位の明示的migrationと旧fixtureを追加します。全Chapterの進行や所持品をリセットして移行しないでください。

現在のテンプレートは遊べる物語を含まない最小土台です。未使用の戦闘・イベントファイルを予測で量産しません。
