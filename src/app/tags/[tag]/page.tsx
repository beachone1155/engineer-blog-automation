import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Container from '@/components/Container'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  const posts = getPublishedPosts()
  const allTags = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag))
  })
  
  return Array.from(allTags).map(tag => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag)
  const posts = getPublishedPosts()
  const taggedPosts = posts.filter(post => post.tags.includes(tag))
  
  return {
    title: `${tag}の記事`,
    description: `${tag}に関する記事一覧 - ${taggedPosts.length}件の記事`,
    openGraph: {
      title: `${tag}の記事 | Engineer Blog`,
      description: `${tag}に関する記事一覧 - ${taggedPosts.length}件の記事`,
    },
  }
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag)
  const posts = getPublishedPosts()
  const taggedPosts = posts.filter(post => post.tags.includes(tag))

  return (
    <Container className="py-8">
      <Breadcrumb 
        items={[
          { label: 'タグ', href: '/tags' },
          { label: `${tag}の記事` }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{tag}の記事</h1>
        <p className="text-muted-foreground">
          {taggedPosts.length}件の記事が見つかりました
        </p>
      </div>
      
      {taggedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">このタグの記事はありません。</p>
          <Link 
            href="/tags"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            タグ一覧に戻る
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {taggedPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {post.cover && (
                <div className="aspect-video relative">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.summary}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'yyyy年MM月dd日', { locale: ja })}
                  </time>
                  <div className="flex space-x-2">
                    {post.tags.slice(0, 2).map((postTag) => (
                      <span
                        key={postTag}
                        className={`px-2 py-1 rounded-full text-xs ${
                          postTag === tag 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {postTag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-gray-400 text-xs">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  )
}
