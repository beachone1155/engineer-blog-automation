import Link from 'next/link'
import { getPublishedPosts } from '@/lib/posts'
import Container from '@/components/Container'
import { Badge } from '@/components/ui/badge'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'タグ',
  description: 'ブログ記事のタグ一覧 - カテゴリ別に記事を探す',
  openGraph: {
    title: 'タグ | Engineer Blog',
    description: 'ブログ記事のタグ一覧 - カテゴリ別に記事を探す',
  },
}

export default function TagsPage() {
  const posts = getPublishedPosts()
  
  // タグを集計
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  // タグを記事数順でソート
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }))

  return (
    <Container className="py-8">
      <Breadcrumb 
        items={[
          { label: 'タグ' }
        ]} 
      />
      <h1 className="text-4xl font-bold mb-8">タグ</h1>
      
      {sortedTags.length === 0 ? (
        <p className="text-gray-600">タグがありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tag}
                </h2>
                <Badge variant="secondary">
                  {count}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {count}件の記事
              </p>
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}
