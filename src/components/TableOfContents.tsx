'use client'

import { useState, useEffect } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // H2とH3を抽出
    const headings = content.match(/^#{2,3}\s+(.+)$/gm)
    if (headings) {
      const tocItems: TOCItem[] = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 2
        const text = heading.replace(/^#+\s+/, '')
        const id = `heading-${index}`
        return { id, text, level }
      })
      setToc(tocItems)
    }
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map(item => document.getElementById(item.id))
      const visibleHeadings = headings.filter(heading => {
        if (!heading) return false
        const rect = heading.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })
      
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (toc.length === 0) return null

  return (
    <>
      {/* モバイル用の折りたたみTOC */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-4 bg-muted rounded-lg border border-border"
        >
          <h3 className="font-semibold text-foreground">目次</h3>
        </button>
        {isOpen && (
          <div className="mt-2 p-4 bg-muted rounded-lg border border-border">
            <nav>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block py-1 text-sm hover:text-primary transition-colors ${
                        item.level === 3 ? 'ml-4' : ''
                      } ${activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* デスクトップ用のサイドTOC */}
      <div className="hidden lg:block">
        <div className="bg-muted p-4 rounded-lg border border-border">
          <h3 className="font-semibold mb-3 text-foreground">目次</h3>
          <nav>
            <ul className="space-y-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-1 text-sm hover:text-primary transition-colors ${
                      item.level === 3 ? 'ml-4' : ''
                    } ${activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
