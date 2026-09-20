# Lumenfall Editor v0.1

`npm run dev` → `http://127.0.0.1:5173/?editor=1`、またはVS Codeの「実行とデバッグ → Lumenfall: Editor → F5」。PCで使う開発専用ツールです。`npm run build` / Preview / PagesではEditorを起動せず、Editor用コードとCSSも生成されません。

## 操作

1. 上部でChapterとMapを選択。未保存の変更がある場合は破棄確認が出ます。
2. Hierarchy、またはSceneの色付き配置マーカーをクリック。ID・Kind・Sourceは読取専用です。
3. InspectorのName / X / Z / Radiusを編集し、Tabまたは欄外クリックで確定。Yは地形の高さに追従します。
4. Moveギズモの赤いX軸・青いZ軸をドラッグ。SnapはOFF / 0.25 / 0.5 / 1.0。Inspectorの数値入力はそのままの精密値を使います。
5. 左ドラッグでOrbit、右ドラッグでPan、ホイールでZoom。「Frame selected」で選択地点を中心にします。
6. Grid / Collisionを切り替え。Collisionは既存blocksの赤い枠と、配置radiusの黄色い円です。ゲームのwalkable関数全体を可視化するものではありません。
7. Draft kind → Add DraftでNPC / Enemy / Chest / Propの仮配置を追加。Delete selectedはEditor内だけの削除です。既存配置は確認が必要です。
8. JSON Export / TypeScript Export → Copy。Downloadも用意しています。ゲーム側への反映は開発者が差分を確認して手動で行います。

## 保存と安全な境界

Save Draft / Load Draftはブラウザの `lumenfall-editor-draft` のみを使用します。保存できるのは一度に1マップです。Clear Draftは保存済みDraftを消し、現在の表示中の編集は残します。通常save・DEBUG saveを読み書きしません。ブラウザのデータ削除でDraftも消えるため、残したいものはJSON Exportしてください。

`scene-adapter.ts` はfreshな一時状態に既存DEBUG travelの解放条件を適用し、`sceneryOnly` で既存マップを組み立てます。ゲーム進行用のsave / talk / battle等は実行しません。配置情報は既存catalogのDEBUG定義とマップから取得し、Chapter 1の古いDEBUG定義が返さない宝箱だけはEditor内で補います。

HierarchyはPlayer Start、NPC・操作対象、敵、ボス、宝箱、出口、Draft Propを表示します。地形・内部helperを無差別に並べません。Scene上の配置は識別用マーカーです。家・木・水面・光源は簡略表示で、ゲーム本編と完全に同じ見た目にはなりません。光源編集、地形編集、回転・Scale編集、Undo、Prefab、ソース自動書換、Git操作はありません。

## Exportの反映先

JSONはversion / chapterId / mapId / objectsのみ。各objectはID、kind、name、X/Z、radius、sourceと配置に必要なmetadataです。mesh・helper・材質・ゲームsaveは含みません。

TypeScriptはPlayer StartとWorldObject形式の配置リスト、sprite / scale / destination等のmetadataを返します。Chapter固有の`object-config.ts`へ合わせてください。同じゲームIDが宝箱と他の対象で使われている場合もあるため、kindも照合してください。宝箱の報酬・NPCイベント・敵定義は生成しません。Draftの`needsDefinition: true`を残作業の目印にします。

## Play From Hereの範囲

v0.1は **Copy DEBUG teleport** までです。一時Playタブの自動起動、Play/Stopループ、Editor配置のゲームへの自動反映は未実装です。

出力例: `{"chapterId":"chapter-4","mapId":2,"x":8,"z":7}`。
別タブの`?debug=1`でDEBUG → World → Chapter → Go、Map → Teleport、X/Z → Teleport to coordinatesの順に入力します。通常セーブは使いません。ゲームのwalkable判定により座標が拒否される場合は安全な地点へ調整します。

確認済み・未確認の範囲は[検証報告](EDITOR-FOUNDATION-REPORT.md)を参照してください。
