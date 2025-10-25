# 記事作成用AIプロンプト（簡潔版）

## プロンプト

```
技術記事のMarkdownファイルを作成してください。

## 制約事項
- **タグは最大4個まで**（DEV.toの制限）
- **タグは英数字のみ**（例: "nextjs", "githubactions"）
- **Frontmatterは1つだけ**（重複禁止）
- **created_atとupdated_atは必須**

## Frontmatterテンプレート
```yaml
---
title: "記事タイトル"
slug: "記事スラッグ"
summary: "要約（150文字以内）"
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

## 注意
- タグ例: "nextjs", "react", "typescript", "aws"
- 避ける例: "Next.js", "GitHub-Actions", "dev.to"
- カノニカルURLは末尾にスラッシュなし

この仕様で記事を作成してください。
```

## 使用例

```
上記のプロンプトに続けて：

「Next.jsのApp Routerについて、初心者向けに解説する記事を作成してください。実装例も含めてください。」
```
