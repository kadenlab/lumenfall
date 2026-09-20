# 横展開コンテンツの契約

灯の試練と灯路異変調査は統合しません。前者は灯・連戦、後者は痕跡・強化個体・報酬という異なる進行を持ち、現段階で新しいSide Content Frameworkは不要です。

- 本編Chapter catalogへの通常Chapter登録と、横展開のregistry登録は区別する。
- 専用save namespaceを持ち、main campaignのQuest/Boss/Chestを上書きしない。
- 解放は本編の正式完了記録から判定する。画面の表示フラグやDEBUG注入だけを条件にしない。
- 移動入口、メニュー、解放通知の追加位置を明記する。既存の追加位置はchapters/registry.ts、chapters/catalog.tsのprerequisite、systems/chapter-unlocks.ts、game.tsのメニュー、debug/debug-actions.ts。
- 専用migrationは欠落したnamespaceを補う。既存namespaceの途中進行、報酬履歴、装備を消さない。
- 報酬に永続的な受領済み記録を持ち、再読込や同一勝利通知で二重付与しない。再戦報酬と初回報酬を分ける。
- DEBUGは通常saveから分離したキーを使う。専用プリセットを用意し、本編側へテスト進行を書き込まない。
- 追加テスト: 解放の境界、途中save、全クリアsave、重複報酬、離脱／敗北、本編進行の不変性。

第3の横展開コンテンツが具体化した時点で、実際の共通部分だけmetadata化を再検討します。今回の実装では新規registryは追加していません。
