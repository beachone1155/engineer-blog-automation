#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 環境変数
const DRY_RUN = process.env.DRY_RUN === 'true'
const QIITA_TOKEN = process.env.QIITA_TOKEN
const DEVTO_TOKEN = process.env.DEVTO_TOKEN

// 設定
const CONTENT_DIR = path.join(__dirname, '..', 'content')
const ZENN_REPO_SSH = process.env.ZENN_REPO_SSH || 'git@github.com:TODO: あなたのユーザー名/zenn-content.git'

// ログ関数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

// 記事を取得
function getAllPosts() {
  const posts = []
  
  function scanDirectory(dir) {
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
        const relativePath = path.relative(CONTENT_DIR, fullPath)
        const pathParts = relativePath.split(path.sep)
        const year = pathParts[0]
        const month = pathParts[1]
        const slug = pathParts[2].replace('.md', '')
        
        const post = {
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
          filePath: fullPath
        }
        
        posts.push(post)
      }
    }
  }
  
  scanDirectory(CONTENT_DIR)
  return posts
}

// Qiita投稿
async function publishToQiita(post) {
  if (!QIITA_TOKEN) {
    log('QIITA_TOKENが設定されていません', 'error')
    return false
  }

  const qiitaPost = {
    title: post.title,
    body: post.content,
    tags: post.tags.map(tag => ({ name: tag })),
    private: false,
    tweet: false
  }

  if (DRY_RUN) {
    log(`[DRY RUN] Qiita投稿: ${post.title}`, 'info')
    return true
  }

  try {
    const response = await fetch('https://qiita.com/api/v2/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QIITA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qiitaPost)
    })

    if (response.ok) {
      const result = await response.json()
      log(`Qiita投稿成功: ${result.url}`, 'success')
      return true
    } else {
      const error = await response.text()
      log(`Qiita投稿失敗: ${response.status} ${error}`, 'error')
      return false
    }
  } catch (error) {
    log(`Qiita投稿エラー: ${error.message}`, 'error')
    return false
  }
}

// DEV.to投稿
async function publishToDevTo(post) {
  if (!DEVTO_TOKEN) {
    log('DEVTO_TOKENが設定されていません', 'error')
    return false
  }

  const devToPost = {
    article: {
      title: post.title,
      body_markdown: post.content,
      tags: post.tags,
      canonical_url: post.canonical_url,
      published: true
    }
  }

  if (DRY_RUN) {
    log(`[DRY RUN] DEV.to投稿: ${post.title}`, 'info')
    return true
  }

  try {
    const response = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'api-key': DEVTO_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(devToPost)
    })

    if (response.ok) {
      const result = await response.json()
      log(`DEV.to投稿成功: ${result.url}`, 'success')
      return true
    } else {
      const error = await response.text()
      log(`DEV.to投稿失敗: ${response.status} ${error}`, 'error')
      return false
    }
  } catch (error) {
    log(`DEV.to投稿エラー: ${error.message}`, 'error')
    return false
  }
}

// Zenn投稿（別リポジトリへの同期）
async function publishToZenn(post) {
  if (!ZENN_REPO_SSH || ZENN_REPO_SSH.includes('TODO')) {
    log('ZENN_REPO_SSHが設定されていません', 'error')
    return false
  }

  if (DRY_RUN) {
    log(`[DRY RUN] Zenn同期: ${post.title}`, 'info')
    return true
  }

  try {
    // この部分は後でZenn連携ジョブで実装
    log(`Zenn同期: ${post.title}`, 'info')
    return true
  } catch (error) {
    log(`Zenn同期エラー: ${error.message}`, 'error')
    return false
  }
}

// メイン処理
async function main() {
  log('投稿処理を開始します...', 'info')
  
  if (DRY_RUN) {
    log('DRY RUNモードで実行中...', 'info')
  }

  const posts = getAllPosts()
  const publishablePosts = posts.filter(post => !post.draft && post.publish_on.length > 0)

  log(`${publishablePosts.length}件の記事を処理します`, 'info')

  let successCount = 0
  let errorCount = 0

  for (const post of publishablePosts) {
    log(`処理中: ${post.title}`, 'info')
    
    const results = await Promise.allSettled([
      post.publish_on.includes('qiita') ? publishToQiita(post) : Promise.resolve(true),
      post.publish_on.includes('devto') ? publishToDevTo(post) : Promise.resolve(true),
      post.publish_on.includes('zenn') ? publishToZenn(post) : Promise.resolve(true)
    ])

    const hasError = results.some(result => result.status === 'rejected' || result.value === false)
    
    if (hasError) {
      errorCount++
      log(`記事の処理でエラーが発生しました: ${post.title}`, 'error')
    } else {
      successCount++
      log(`記事の処理が完了しました: ${post.title}`, 'success')
    }
  }

  log(`処理完了: 成功 ${successCount}件, エラー ${errorCount}件`, 'info')

  if (errorCount > 0) {
    process.exit(1)
  }
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
  log(`未処理のPromise拒否: ${reason}`, 'error')
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  log(`未処理の例外: ${error.message}`, 'error')
  process.exit(1)
})

// 実行
main().catch(error => {
  log(`メイン処理でエラーが発生しました: ${error.message}`, 'error')
  process.exit(1)
})
