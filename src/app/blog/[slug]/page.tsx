import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import MDXContent from '@/components/MDXContent'
import Container from '@/components/Container'
import TableOfContents from '@/components/TableOfContents'
import Breadcrumb from '@/components/Breadcrumb'
import ShareButtons from '@/components/ShareButtons'
import AuthorCard from '@/components/AuthorCard'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
      description: 'お探しの記事が見つかりませんでした。',
    }
  }

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: 'Engineer Blog' }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      authors: ['Engineer Blog'],
      tags: post.tags,
      images: post.cover ? [
        {
          url: post.cover,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.cover ? [post.cover] : [],
    },
    ...(post.canonical_url && {
      alternates: {
        canonical: post.canonical_url,
      },
    }),
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <Container className="py-8">
      <Breadcrumb 
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]} 
      />
      
      <div className="flex gap-8">
        {/* メインコンテンツ */}
        <article className="flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'yyyy年MM月dd日', { locale: ja })}
              </time>
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {post.cover && (
              <Image
                src={post.cover}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-2xl shadow-sm mb-8"
              />
            )}
          </header>
          
          {/* モバイル用TOC */}
          <TableOfContents content={post.content} />
          
          <div className="article-content">
            <MDXContent content={post.content} />
          </div>
          
          {/* シェアボタン */}
          <div className="mt-8 pt-8 border-t">
            <ShareButtons 
              title={post.title}
              url={`https://engineer-blog-automation.vercel.app/blog/${post.slug}`}
              tags={post.tags}
            />
          </div>
          
          {/* 著者カード */}
          <AuthorCard />
        </article>
        
        {/* デスクトップ用サイドTOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </Container>
  )
}
