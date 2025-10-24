import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import MDXContent from '@/components/MDXContent'

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
    }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
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
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <time dateTime={post.date}>
                {format(new Date(post.date), 'yyyy年MM月dd日', { locale: ja })}
              </time>
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {post.cover && (
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
          </header>
          
          <MDXContent content={post.content} />
        </article>
      </div>
    </main>
  )
}
