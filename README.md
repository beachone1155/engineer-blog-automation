# エンジニアブログ自動化プロジェクト

Next.js 14+ (App Router) と MDX を使用した自前ブログシステムです。Qiita、Zenn、DEV.to への自動配信機能を搭載しています。

## プロジェクトの設計原則

このプロジェクトでは以下の原則を厳守しています：

- **型安全**: Frontmatterは型定義して欠落時はビルドエラー
- **ログ**: 投稿スクリプトは成功/失敗を明確にログ（記事のtitleと送信先を必ず表示）
- **再実行性**: 同一記事の二重投稿を避けるため、API側の下書き→公開や既存検知が可能なら対応（最低限、DRY_RUNあり）
- **SEO**: DEV.toはcanonical_url、Qiitaは本文先頭に「Originally published at …」リンクを自動差し込み（オプション）
- **秘密情報**: Actionsのsecrets参照のみで、コード/ログに漏らさない
- **コメント**: すべての新規/変更ファイルに目的コメントとTODOプレースホルダを残す

## 機能

- 📝 **MDX対応**: Markdown + JSX でリッチな記事作成
- 🚀 **自動配信**: Qiita、Zenn、DEV.to への自動投稿
- 🎨 **モダンUI**: Tailwind CSS による美しいデザイン
- 🔧 **型安全**: TypeScript による型定義
- 🤖 **自動化**: GitHub Actions による自動デプロイ・投稿
- 📱 **レスポンシブ**: モバイル対応
- 🔍 **SEO対応**: カノニカルURL、OGP対応

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React 18
- **コンテンツ**: MDX, gray-matter
- **スタイリング**: Tailwind CSS, @tailwindcss/typography
- **デプロイ**: Vercel
- **自動化**: GitHub Actions
- **言語**: TypeScript

## セットアップ手順

### 1. プロジェクトの初期化

```bash
# リポジトリをクローン
git clone https://github.com/TODO: あなたのユーザー名/zenn-blog.git
cd zenn-blog

# 依存関係をインストール
npm install -g pnpm
pnpm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# 開発環境用（オプション）
NEXT_PUBLIC_SITE_URL=https://TODO: あなたのドメイン.com
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### 4. 記事の作成

`content/YYYY/MM/slug.md` の形式で記事を作成してください。

例：`content/2025/01/my-first-post.md`

```markdown
---
title: "記事のタイトル"
slug: "article-slug"
summary: "記事の概要"
tags: ["Next.js", "MDX", "ブログ"]
cover: "/images/cover.jpg"
lang: "ja"
canonical_url: "https://TODO: あなたのドメイン.com/blog/article-slug"
publish_on: ["qiita", "zenn", "devto"]
draft: false
---

# 記事の内容

ここにMarkdownで記事を書きます。
```

## Frontmatter 仕様（型安全）

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|------|
| `title` | string | ✅ | 記事のタイトル |
| `slug` | string | ✅ | URL用のスラッグ |
| `summary` | string | ✅ | 記事の概要（meta description） |
| `tags` | string[] | ✅ | タグの配列 |
| `cover` | string | ❌ | カバー画像のパス |
| `lang` | string | ✅ | 言語（デフォルト: "ja"） |
| `canonical_url` | string | ❌ | カノニカルURL（SEO用） |
| `publish_on` | string[] | ✅ | 配信先（"qiita", "zenn", "devto"） |
| `draft` | boolean | ✅ | 下書きフラグ（デフォルト: false） |
| `created_at` | string | ✅ | 作成日（YYYY-MM-DD形式） |
| `updated_at` | string | ❌ | 更新日（YYYY-MM-DD形式） |

**注意**: 必須フィールドが欠落している場合、ビルド時にエラーが発生します。

## 自動配信の設定

### 1. GitHub Secrets の設定

リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください：

#### Qiita API
- `QIITA_TOKEN`: Qiitaのアクセストークン

#### DEV.to API
- `DEVTO_TOKEN`: DEV.toのAPIキー

#### Zenn 連携
- `ZENN_REPO_SSH`: Zenn用リポジトリのSSH URL
- `ZENN_SSH_KEY`: Zenn用リポジトリへのアクセス用SSH鍵

### 2. Zenn 用リポジトリの準備

1. 新しいリポジトリ `zenn-content` を作成
2. リポジトリのSSH URLを `ZENN_REPO_SSH` に設定
3. デプロイ鍵またはPersonal Access Tokenを `ZENN_SSH_KEY` に設定

### 3. API トークンの取得方法

#### Qiita
1. [Qiita](https://qiita.com) にログイン
2. Settings > Applications > Personal access tokens
3. 新しいトークンを作成

#### DEV.to
1. [DEV.to](https://dev.to) にログイン
2. Settings > DEV Community > Extensions
3. API Keys セクションで新しいキーを作成

## 使用方法

### 記事の投稿

1. `content/` ディレクトリに記事を作成
2. `publish_on` に配信先を指定
3. 変更をコミット・プッシュ
4. GitHub Actions が自動的に配信を実行

### 手動での投稿テスト

```bash
# ドライランモードでテスト
pnpm publish:dry-run

# 実際に投稿
pnpm publish
```

### Zenn 同期のテスト

```bash
# ドライランモードでテスト
DRY_RUN=true node scripts/zenn-sync.mjs

# 実際に同期
node scripts/zenn-sync.mjs
```

## ディレクトリ構造

```
├── content/                 # 記事ファイル
│   └── YYYY/MM/slug.md
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── blog/           # ブログページ
│   │   └── globals.css     # グローバルスタイル
│   ├── components/         # Reactコンポーネント
│   ├── lib/               # ユーティリティ関数
│   └── types/             # TypeScript型定義
├── scripts/               # 投稿スクリプト
│   ├── publish.mjs        # メイン投稿スクリプト
│   └── zenn-sync.mjs      # Zenn同期スクリプト
├── .github/workflows/     # GitHub Actions
└── public/               # 静的ファイル
```

## カスタマイズ

### サイト情報の変更

`src/app/layout.tsx` でサイトのタイトルや説明を変更できます。

### スタイルの変更

`tailwind.config.js` でTailwind CSSの設定をカスタマイズできます。

### 投稿先の追加

`src/types/post.ts` で型定義を追加し、`scripts/publish.mjs` で投稿ロジックを実装してください。

## トラブルシューティング

### 投稿に失敗した場合

1. GitHub Actions のログを確認
2. 環境変数が正しく設定されているか確認
3. API トークンが有効か確認
4. 手動でスクリプトを実行してテスト

### 再送方法

1. 該当記事の `publish_on` を一時的に空にする
2. 変更をコミット・プッシュ
3. `publish_on` を元に戻す
4. 再度コミット・プッシュ

### よくある問題

- **Qiita投稿エラー**: トークンの権限を確認
- **DEV.to投稿エラー**: APIキーが正しく設定されているか確認
- **Zenn同期エラー**: SSH鍵の設定を確認

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 更新履歴

- v1.0.0: 初期リリース
  - Next.js 14 + MDX対応
  - 自動配信機能
  - GitHub Actions統合
