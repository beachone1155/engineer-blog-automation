import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostFrontmatter } from '@/types/post'

const contentDirectory = path.join(process.cwd(), 'content')

export function getAllPosts(): Post[] {
  const posts: Post[] = []
  
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (item.endsWith('.md')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        // パスから日付を抽出
        const relativePath = path.relative(contentDirectory, fullPath)
        const pathParts = relativePath.split(path.sep)
        const year = pathParts[0]
        const month = pathParts[1]
        const slug = pathParts[2].replace('.md', '')
        
        const post: Post = {
          slug,
          title: data.title || '',
          summary: data.summary || '',
          tags: data.tags || [],
          cover: data.cover,
          lang: data.lang || 'ja',
          canonical_url: data.canonical_url,
          publish_on: data.publish_on || [],
          draft: data.draft || false,
          content,
          date: `${year}-${month}-01`,
          year,
          month,
        }
        
        posts.push(post)
      }
    }
  }
  
  scanDirectory(contentDirectory)
  
  // 日付順でソート（新しい順）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter(post => !post.draft)
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter(post => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const posts = getPublishedPosts()
  const tagSet = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}
