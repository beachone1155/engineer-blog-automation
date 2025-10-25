'use client'

import { Button } from '@/components/ui/button'
import { Share2, Twitter, MessageCircle, Bookmark } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url: string
  tags?: string[]
}

export default function ShareButtons({ title, url, tags = [] }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedTags = tags.map(tag => tag.replace(/\s+/g, '')).join(',')

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${encodedTags}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/${url}`,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // フォールバック: URLをクリップボードにコピー
      await navigator.clipboard.writeText(url)
      alert('URLをクリップボードにコピーしました')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">シェア:</span>
      
      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1"
        >
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a
          href={shareLinks.bluesky}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Bluesky</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a
          href={shareLinks.hatena}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1"
        >
          <Bookmark className="h-4 w-4" />
          <span>はてブ</span>
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="flex items-center space-x-1"
      >
        <Share2 className="h-4 w-4" />
        <span>その他</span>
      </Button>
    </div>
  )
}
