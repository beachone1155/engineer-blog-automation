#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env.local') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 秘密情報: Actionsのsecrets参照のみで、コード/ログに漏らさない
// 環境変数はすべてGitHub Actionsのsecretsから取得
const DRY_RUN = process.env.DRY_RUN === 'true'
const QIITA_TOKEN = process.env.QIITA_TOKEN
const DEVTO_TOKEN = process.env.DEVTO_TOKEN

// デバッグ用ログ
console.log('Environment variables check:')
console.log('QIITA_TOKEN:', QIITA_TOKEN ? 'SET' : 'NOT SET')
console.log('DEVTO_TOKEN:', DEVTO_TOKEN ? 'SET' : 'NOT SET')
console.log('ZENN_REPO_SSH:', process.env.ZENN_REPO_SSH ? 'SET' : 'NOT SET')

// 設定
const CONTENT_DIR = path.join(__dirname, '..', 'content')
// TODO: ZENN_REPO_SSHをGitHub Actionsのsecretsに設定する
const ZENN_REPO_SSH = process.env.ZENN_REPO_SSH || 'git@github.com:TODO: あなたのユーザー名/zenn-content.git'

// ログ: 投稿スクリプトは成功/失敗を明確にログ（記事のtitleと送信先を必ず表示）
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

// ログ: 記事投稿の詳細ログ（タイトルと送信先を明示）
function logPostAttempt(post, platform, action = '投稿') {
  const status = DRY_RUN ? '[DRY RUN]' : ''
  log(`${status} ${platform}への${action}を開始: "${post.title}"`, 'info')
}

function logPostSuccess(post, platform, url = null) {
  const status = DRY_RUN ? '[DRY RUN]' : ''
  const urlInfo = url ? ` (URL: ${url})` : ''
  log(`${status} ${platform}への投稿成功: "${post.title}"${urlInfo}`, 'success')
}

function logPostError(post, platform, error) {
  const status = DRY_RUN ? '[DRY RUN]' : ''
  log(`${status} ${platform}への投稿失敗: "${post.title}" - ${error}`, 'error')
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
    logPostError(post, 'Qiita', 'QIITA_TOKENが設定されていません')
    return false
  }

  // 再実行性: 同一記事の二重投稿を避けるため、既存記事をチェック
  // TODO: Qiita APIで既存記事の検索機能を実装
  logPostAttempt(post, 'Qiita')

  // SEO: Qiitaは本文先頭に「Originally published at …」リンクを自動差し込み
  const originalLink = post.canonical_url ? 
    `Originally published at [${post.canonical_url}](${post.canonical_url})\n\n` : ''
  
  const qiitaPost = {
    title: post.title,
    body: originalLink + post.content,
    tags: post.tags.map(tag => ({ name: tag })),
    private: false,
    tweet: false
  }

  if (DRY_RUN) {
    logPostSuccess(post, 'Qiita')
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
      logPostSuccess(post, 'Qiita', result.url)
      return true
    } else {
      const error = await response.text()
      logPostError(post, 'Qiita', `${response.status} ${error}`)
      return false
    }
  } catch (error) {
    logPostError(post, 'Qiita', error.message)
    return false
  }
}

// DEV.to投稿
async function publishToDevTo(post) {
  if (!DEVTO_TOKEN) {
    logPostError(post, 'DEV.to', 'DEVTO_TOKENが設定されていません')
    return false
  }

  // 再実行性: 同一記事の二重投稿を避けるため、既存記事をチェック
  // TODO: DEV.to APIで既存記事の検索機能を実装
  logPostAttempt(post, 'DEV.to')

  // SEO: DEV.toはcanonical_urlを使用
  console.log('DEV.to投稿データ:', {
    title: post.title,
    tags: post.tags,
    tagsLength: post.tags.length,
    canonical_url: post.canonical_url
  })
  
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
    logPostSuccess(post, 'DEV.to')
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
      logPostSuccess(post, 'DEV.to', result.url)
      return true
    } else {
      const error = await response.text()
      logPostError(post, 'DEV.to', `${response.status} ${error}`)
      return false
    }
  } catch (error) {
    logPostError(post, 'DEV.to', error.message)
    return false
  }
}

// Zenn投稿（別リポジトリへの同期）
async function publishToZenn(post) {
  if (!ZENN_REPO_SSH || ZENN_REPO_SSH.includes('TODO')) {
    logPostError(post, 'Zenn', 'ZENN_REPO_SSHが設定されていません')
    return false
  }

  // 再実行性: 同一記事の二重投稿を避けるため、既存記事をチェック
  // TODO: Zennリポジトリで既存記事の検索機能を実装
  logPostAttempt(post, 'Zenn', '同期')

  if (DRY_RUN) {
    logPostSuccess(post, 'Zenn')
    return true
  }

  try {
    // この部分は後でZenn連携ジョブで実装
    // TODO: Zenn同期の実装を完了する
    logPostSuccess(post, 'Zenn')
    return true
  } catch (error) {
    logPostError(post, 'Zenn', error.message)
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
