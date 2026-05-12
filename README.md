# 手術判断

GitHub Pages で公開するための静的サイト用リポジトリです。

## ローカルで作成したページを入れる場所

- トップページは `index.html` に配置します。
- CSS、画像、JavaScript などは `assets/` 以下に置けます。
- 既にローカルで作成済みの `index.html` がある場合は、このリポジトリ直下の `index.html` と差し替えてください。

## GitHub Pages の設定

GitHub に push したあと、リポジトリの `Settings` > `Pages` で次を選びます。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

保存後、数分で Pages の URL が表示されます。
