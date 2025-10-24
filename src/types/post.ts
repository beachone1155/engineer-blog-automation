export interface Post {
  slug: string
  title: string
  summary: string
  tags: string[]
  cover?: string
  lang: string
  canonical_url?: string
  publish_on: ('qiita' | 'zenn' | 'devto')[]
  draft: boolean
  content: string
  date: string
  year: string
  month: string
}

// 型安全: Frontmatterの必須フィールドを厳密に定義
// 欠落時はビルドエラーになるように必須フィールドを明示
export interface PostFrontmatter {
  /** 記事のタイトル（必須） */
  title: string
  /** 記事のスラッグ（必須） */
  slug: string
  /** 記事の要約（必須） */
  summary: string
  /** 記事のタグ（必須、空配列も許可） */
  tags: string[]
  /** カバー画像URL（オプション） */
  cover?: string
  /** 言語設定（必須、デフォルト: 'ja'） */
  lang: string
  /** 正規URL（SEO用、オプション） */
  canonical_url?: string
  /** 投稿先プラットフォーム（必須、空配列も許可） */
  publish_on: ('qiita' | 'zenn' | 'devto')[]
  /** 下書きフラグ（必須） */
  draft: boolean
  /** 作成日（必須、YYYY-MM-DD形式） */
  created_at: string
  /** 更新日（オプション、YYYY-MM-DD形式） */
  updated_at?: string
}

// 型安全: Frontmatter検証用の型ガード関数
export function isValidPostFrontmatter(data: any): data is PostFrontmatter {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.title === 'string' &&
    data.title.trim().length > 0 &&
    typeof data.slug === 'string' &&
    data.slug.trim().length > 0 &&
    typeof data.summary === 'string' &&
    data.summary.trim().length > 0 &&
    Array.isArray(data.tags) &&
    data.tags.every((tag: any) => typeof tag === 'string') &&
    typeof data.lang === 'string' &&
    data.lang.trim().length > 0 &&
    Array.isArray(data.publish_on) &&
    data.publish_on.every((platform: any) => 
      ['qiita', 'zenn', 'devto'].includes(platform)
    ) &&
    typeof data.draft === 'boolean' &&
    typeof data.created_at === 'string' &&
    data.created_at.trim().length > 0
  )
}

export interface QiitaPost {
  title: string
  body: string
  tags: Array<{ name: string }>
  private: boolean
  tweet: boolean
}

export interface DevToPost {
  article: {
    title: string
    body_markdown: string
    tags: string[]
    canonical_url?: string
    published: boolean
  }
}

export interface ZennPost {
  title: string
  emoji: string
  type: 'tech' | 'idea'
  topics: string[]
  published: boolean
  content: string
}
