# 記事作成用AIプロンプト

## 概要
このプロンプトは、マルチ投稿ブログシステム用のMarkdown記事を作成する際にAIに渡すプロンプトです。Qiita、Zenn、DEV.to、GitHub Pages、Vercelに自動投稿される記事のFrontmatterとコンテンツを作成します。

## プロンプト

```
以下の仕様に従って、技術記事のMarkdownファイルを作成してください。

## 記事の基本情報
- タイトル: [記事のタイトル]
- スラッグ: [記事のスラッグ（英数字とハイフンのみ）]
- 要約: [記事の要約（150文字以内）]
- カバー画像: "/images/[記事スラッグ]-cover.jpg"
- 言語: "ja"
- カノニカルURL: "https://beachone1155.github.io/engineer-blog-automation/blog/[記事スラッグ]"
- 投稿先: ["qiita", "zenn", "devto"]
- 下書き: false

## タグの制限（重要）
- **最大4タグまで**（DEV.toの制限）
- **英数字のみ**（ハイフン、アンダースコア、ピリオドは使用不可）
- 例: "nextjs", "githubactions", "qiita", "zenn"
- 避けるべき例: "Next.js", "GitHub-Actions", "dev.to"

## 必須フィールド
- created_at: "YYYY-MM-DD"（記事作成日）
- updated_at: "YYYY-MM-DD"（記事更新日）

## Frontmatterの形式
```yaml
---
title: "記事のタイトル"
slug: "記事スラッグ"
summary: "記事の要約（150文字以内）"
tags: ["タグ1", "タグ2", "タグ3", "タグ4"]
cover: "/images/記事スラッグ-cover.jpg"
lang: "ja"
canonical_url: "https://beachone1155.github.io/engineer-blog-automation/blog/記事スラッグ"
publish_on: ["qiita", "zenn", "devto"]
draft: false
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
---
```

## コンテンツの要件
- Markdown形式で記述
- コードブロックには言語指定を追加
- 画像は`/images/`ディレクトリに配置することを前提
- 見出しは適切な階層で構成
- リストや表を活用して読みやすくする

## 注意事項
1. **Frontmatterは1つだけ**（重複定義禁止）
2. **タグは4個まで**（DEV.toの制限）
3. **タグは英数字のみ**（特殊文字禁止）
4. **created_atとupdated_atは必須**
5. **canonical_urlは正しい形式**（末尾にスラッシュなし）

## 例
```yaml
---
title: "Next.jsでSSRとSSGを使い分ける方法"
slug: "nextjs-ssr-ssg-guide"
summary: "Next.jsのSSRとSSGの違いと使い分け方を、実際のコード例とともに解説します。"
tags: ["nextjs", "react", "ssr", "ssg"]
cover: "/images/nextjs-ssr-ssg-guide-cover.jpg"
lang: "ja"
canonical_url: "https://beachone1155.github.io/engineer-blog-automation/blog/nextjs-ssr-ssg-guide"
publish_on: ["qiita", "zenn", "devto"]
draft: false
created_at: "2025-01-25"
updated_at: "2025-01-25"
---

# Next.jsでSSRとSSGを使い分ける方法

## はじめに

Next.jsでは、SSR（Server-Side Rendering）とSSG（Static Site Generation）の両方を使用できます...

## まとめ

適切な使い分けにより、パフォーマンスとSEOを両立できます。
```

この仕様に従って記事を作成してください。
```

## 使用方法

1. このプロンプトをAIに渡す
2. 記事の内容を指定する
3. 生成されたMarkdownファイルを`content/YYYY/MM/`ディレクトリに保存
4. 必要に応じて内容を調整

## 検証

記事作成後は以下のコマンドでFrontmatterを検証できます：

```bash
pnpm validate-frontmatter
```

## トラブルシューティング

### よくあるエラー
1. **タグが4個を超えている**: タグを4個以下に削減
2. **タグに特殊文字が含まれている**: 英数字のみに変更
3. **Frontmatterが重複している**: 1つだけ残して削除
4. **必須フィールドが不足**: `created_at`、`updated_at`を追加

### 修正例
```yaml
# ❌ 間違い
tags: ["Next.js", "GitHub-Actions", "Qiita", "Zenn", "DEV.to", "Vercel"]

# ✅ 正しい
tags: ["nextjs", "githubactions", "qiita", "zenn"]
```
