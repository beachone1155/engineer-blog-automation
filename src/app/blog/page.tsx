import Link from 'next/link'
import { getPublishedPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function BlogPage() {
  const posts = getPublishedPosts()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">ブログ</h1>
        
        {posts.length === 0 ? (
          <p className="text-gray-600">記事がありません。</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-8">
                <div className="flex items-start space-x-4">
                  {post.cover && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-3">{post.summary}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
