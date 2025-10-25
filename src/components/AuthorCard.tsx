import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, Twitter, Mail } from 'lucide-react'

export default function AuthorCard() {
  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Engineer Blog</h3>
            <p className="text-muted-foreground text-sm mb-3">
              エンジニアの技術ブログ。自動化、開発、学習記録を発信しています。
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Next.js</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
            </div>
            
            <div className="flex space-x-3">
              <a
                href="https://github.com/beachone1155"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
