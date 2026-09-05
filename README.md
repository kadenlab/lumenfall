# 灯の継承者 — Lumenfall

ドット絵キャラクターと立体背景で描く、約15分のオリジナル短編ファンタジーRPG。
町 → 琥珀の丘 → 双灯の遺跡 → ボス → エンディングまで遊べます。

## GitHub Pagesで公開する

この一式には、ビルド済みのゲーム `docs/` と編集用ソースを含めています。最初の公開時にビルドや追加サービスの契約は不要です。

1. GitHubで空のリポジトリを作成します。無料プランでPagesを使う場合はPublicを選択します。
2. ZIPを解凍し、中の `docs`、`app`、`standalone`、`scripts`、`tests` と各ファイルをリポジトリ直下にアップロードしてコミットします。ZIPそのものや、その外側のフォルダをアップロードしないでください。
3. **Settings → Pages → Build and deployment** を開きます。
4. **Source: Deploy from a branch**、**Branch: main**、**Folder: /docs** を選び、**Save** を押します。ブランチ名が異なる場合はアップロード先を選びます。
5. 公開処理が完了したら、同じ画面に表示されるURLで遊べます。

`docs/index.html` と `docs/assets/` はセットでアップロードしてください。リポジトリ名を変えても動作する相対パスになっています。GitHub Actions用のシークレットやChatGPTへの接続は不要です。

公式手順：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## URLに個人IDを含めない場合

個人アカウントのGitHub Pages標準URLにはアカウント名が入ります。リポジトリ名だけ変えてもアカウント名は消えません。
個人IDを含めない公開URLには、所有する独自ドメインをPagesの **Custom domain** に設定するか、作品名のOrganizationで公開する必要があります。Organizationの場合、そのOrganization名が標準URLに入ります。
この一式には個人IDや既存の公開先URLを埋め込んでいません。独自ドメインの取得・設定、Organizationの作成、実際の公開は行っていません。

独自ドメインの公式手順：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 操作とセーブ

- WASD / 矢印キー：移動。E / Space：話す・調べる。Esc：メニュー。
- 地面をクリック：指定地点へ自動移動。「次の目的地」の案内ボタンでも自動移動できます。
- スマートフォン：左の移動スティック。指を離すと停止します。案内ボタンによる自動移動もスティック操作で中断できます。
- 戦闘：画面右下のコマンドを選択。
- セーブ：冒険メニューから記録。移動や戦闘後などにも自動保存。

記録はそのブラウザ・公開URLのローカルストレージに保存されます。別端末・別ドメイン・別ブラウザには自動移行しません。

## 今回の修正

- 遺跡の環境光と月光を強め、暗部と霧を調整。月夜の色と松明の光を保ちつつ通路を見やすくしました。
- 案内表示の更新時にも移動スティックを画面から外さず、指を離す通知を保持するよう修正。
- 指を離す、タッチ中断、入力キャプチャ喪失、ウィンドウから離れる場合に移動を解除。小さなスティックの揺れを無視するデッドゾーンも追加。

## 編集・再ビルド

Node.js 22.18以降が必要です。

```sh
npm install
npm run dev
```

主な編集先は `app/game.ts`（ゲームと描画）、`app/input.ts`（スティック）、`app/dungeon.ts`（遺跡）、`app/globals.css`（UI）です。

```sh
npm test
npm run build
```

変更後は更新された `docs/` もコミットしてください。GitHub Pagesはそのビルド済みファイルを配信します。HTMLをダブルクリックしての起動は想定していません。

WebGLが利用できない環境では簡易描画に切り替わり、反射・影・発光などの表現が制限されます。フォントはGoogle Fontsから取得し、利用できない場合は端末のフォントに切り替わります。
