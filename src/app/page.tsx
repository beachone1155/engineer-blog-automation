import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">TODO: ブログタイトル</h1>
        <p className="text-lg mb-8">TODO: ブログの説明</p>
        <div className="space-y-4">
          <Link 
            href="/blog" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ブログ一覧を見る
          </Link>
        </div>
      </div>
    </main>
  )
}
