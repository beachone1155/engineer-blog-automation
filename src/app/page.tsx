import Link from 'next/link'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <Container className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Engineer Blog</h1>
        <p className="text-xl text-muted-foreground mb-8">
          エンジニアの技術ブログ - 自動化、開発、学習記録
        </p>
        <Button asChild size="lg" className="bg-blue text-white hover:bg-blue/90">
          <Link href="/blog">
            ブログ一覧を見る
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>技術記事</CardTitle>
            <CardDescription>
              最新の技術動向や開発ノウハウを発信
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full border-blue text-blue hover:bg-blue hover:text-white">
              <Link href="/blog">
                記事を読む
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>タグ検索</CardTitle>
            <CardDescription>
              カテゴリ別に記事を探す
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full border-blue text-blue hover:bg-blue hover:text-white">
              <Link href="/tags">
                タグを見る
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GitHub</CardTitle>
            <CardDescription>
              ソースコードとプロジェクト情報
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full border-blue text-blue hover:bg-blue hover:text-white">
              <a 
                href="https://github.com/beachone1155/engineer-blog-automation"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHubを見る
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
