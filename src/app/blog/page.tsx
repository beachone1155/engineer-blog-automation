import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Container from '@/components/Container'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ブログ',
  description: 'エンジニアの技術ブログ記事一覧 - 自動化、開発、学習記録',
  openGraph: {
    title: 'ブログ | Engineer Blog',
    description: 'エンジニアの技術ブログ記事一覧 - 自動化、開発、学習記録',
  },
}

export default function BlogPage() {
  const posts = getPublishedPosts()

  return (
    <Container className="py-8">
      <Breadcrumb 
        items={[
          { label: 'ブログ' }
        ]} 
      />
      <h1 className="text-4xl font-bold mb-8">ブログ</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card key={post.slug} className="overflow-hidden hover:shadow-md transition-shadow">
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
              
              <CardHeader>
                <h2 className="text-xl font-semibold line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.summary}
                </p>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'yyyy年MM月dd日', { locale: ja })}
                </time>
                <div className="flex space-x-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="text-muted-foreground text-xs">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
