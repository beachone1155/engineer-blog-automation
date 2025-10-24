# 貢献ガイドライン

このプロジェクトへの貢献を歓迎します。以下のガイドラインに従ってください。

## 開発環境のセットアップ

1. リポジトリをフォーク
2. ローカルにクローン
3. 依存関係をインストール
4. 開発サーバーを起動

```bash
git clone https://github.com/あなたのユーザー名/engineer-blog-automation.git
cd engineer-blog-automation
pnpm install
pnpm dev
```

## 開発の流れ

### 1. ブランチの作成
```bash
git checkout -b feature/新機能名
```

### 2. 開発・テスト
- コードを実装
- テストを実行
- ドライランモードで動作確認

```bash
# 投稿スクリプトのテスト
pnpm publish:dry-run

# Zenn同期のテスト
pnpm zenn-sync:dry-run
```

### 3. コミット
```bash
git add .
git commit -m "feat: 新機能の説明"
```

### 4. プッシュ・プルリクエスト
```bash
git push origin feature/新機能名
```

## コーディング規約

### 必須遵守事項
- **型安全**: Frontmatterは型定義して欠落時はビルドエラー
- **ログ**: 投稿スクリプトは成功/失敗を明確にログ（記事のtitleと送信先を必ず表示）
- **再実行性**: 同一記事の二重投稿を避けるため、API側の下書き→公開や既存検知が可能なら対応（最低限、DRY_RUNあり）
- **SEO**: DEV.toはcanonical_url、Qiitaは本文先頭に「Originally published at …」リンクを自動差し込み（オプション）
- **秘密情報**: Actionsのsecrets参照のみで、コード/ログに漏らさない
- **コメント**: すべての新規/変更ファイルに目的コメントとTODOプレースホルダを残す

### ファイル構造
```
src/
├── types/           # 型定義
├── lib/            # ユーティリティ関数
├── components/     # Reactコンポーネント
└── app/           # Next.js App Router

scripts/
├── publish.mjs     # メイン投稿スクリプト
└── zenn-sync.mjs   # Zenn同期スクリプト
```

## テスト

### 手動テスト
1. ドライランモードでスクリプトを実行
2. ログ出力を確認
3. エラーハンドリングをテスト

### 自動テスト
- GitHub Actionsで自動実行
- 型チェック
- リントチェック

## バグ報告

1. 既存のIssueを確認
2. 新しいIssueを作成
3. 再現手順を明記
4. ログを添付

## 機能追加

1. Issueで議論
2. 実装方針を決定
3. プルリクエストを作成
4. レビューを受ける

## 質問・相談

- GitHub Discussionsを使用
- 日本語で質問
- 具体的な状況を説明

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
