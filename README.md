# SekitsuiKyosaku

脊柱管狭窄症 手術のための判断軸

GitHub Pages で公開するための静的サイト用リポジトリです。トップページは `index.html` です。

## ファイル構成

- `index.html`: GitHub Pages が最初に表示するページ
- `app.jsx`: アプリ全体のタブ切り替えと状態管理
- `data.jsx`: 選択肢や文言などのデータ
- `ui.jsx`: 共通 UI 部品
- `tab-*.jsx`: 各タブの画面
- `assets/`: CSS や画像などの静的ファイル置き場

## GitHub Pages の設定

GitHub に push したあと、リポジトリの `Settings` > `Pages` で次を選びます。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

保存後、数分で Pages の URL が表示されます。

## ローカル確認

このフォルダで次を実行すると、ブラウザで確認できます。

```sh
python3 -m http.server 8000
```

その後、`http://localhost:8000` を開きます。
