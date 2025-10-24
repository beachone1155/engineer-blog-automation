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

export interface PostFrontmatter {
  title: string
  slug: string
  summary: string
  tags: string[]
  cover?: string
  lang: string
  canonical_url?: string
  publish_on: ('qiita' | 'zenn' | 'devto')[]
  draft: boolean
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
