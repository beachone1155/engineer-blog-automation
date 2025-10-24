#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 環境変数
const DRY_RUN = process.env.DRY_RUN === 'true'
const ZENN_REPO_SSH = process.env.ZENN_REPO_SSH || 'git@github.com:TODO: あなたのユーザー名/zenn-content.git'
const ZENN_SSH_KEY = process.env.ZENN_SSH_KEY

// 設定
const CONTENT_DIR = path.join(__dirname, '..', 'content')
const ZENN_DIR = path.join(__dirname, '..', 'zenn-temp')
const ZENN_ARTICLES_DIR = path.join(ZENN_DIR, 'articles')

// ログ関数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

// SSH設定
function setupSSH() {
  if (ZENN_SSH_KEY) {
    const sshDir = path.join(process.env.HOME, '.ssh')
    const sshKeyPath = path.join(sshDir, 'zenn_key')
    
    try {
      // SSH鍵を保存
      fs.writeFileSync(sshKeyPath, ZENN_SSH_KEY)
      fs.chmodSync(sshKeyPath, 0o600)
      
      // SSH設定
      const sshConfig = `Host zenn-github
  HostName github.com
  User git
  IdentityFile ${sshKeyPath}
  IdentitiesOnly yes
`
      fs.appendFileSync(path.join(sshDir, 'config'), sshConfig)
      
      log('SSH設定が完了しました', 'success')
    } catch (error) {
      log(`SSH設定エラー: ${error.message}`, 'error')
      throw error
    }
  }
}

// Zennリポジトリをクローン
function cloneZennRepo() {
  if (fs.existsSync(ZENN_DIR)) {
    log('既存のZennディレクトリを削除します', 'info')
    fs.rmSync(ZENN_DIR, { recursive: true, force: true })
  }

  const repoUrl = ZENN_REPO_SSH.replace('git@github.com:', 'zenn-github:')
  
  try {
    log('Zennリポジトリをクローンします', 'info')
    execSync(`git clone ${repoUrl} ${ZENN_DIR}`, { stdio: 'inherit' })
    log('Zennリポジトリのクローンが完了しました', 'success')
  } catch (error) {
    log(`Zennリポジトリのクローンに失敗しました: ${error.message}`, 'error')
    throw error
  }
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

// Zenn用の記事を生成
function generateZennPost(post) {
  const zennFrontmatter = {
    title: post.title,
    emoji: '📝', // デフォルト絵文字
    type: 'tech',
    topics: post.tags,
    published: true
  }

  // 既存のFrontmatterを保持しつつ、Zenn用の設定を追加
  const originalMatter = matter(fs.readFileSync(post.filePath, 'utf8'))
  const mergedMatter = {
    ...originalMatter.data,
    ...zennFrontmatter
  }

  // Zenn用のファイル名を生成（yyyymmdd-slug.md形式）
  const date = new Date(post.date)
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const filename = `${dateStr}-${post.slug}.md`

  // 新しいFrontmatterとコンテンツを結合
  const zennContent = matter.stringify(post.content, mergedMatter)

  return {
    filename,
    content: zennContent
  }
}

// Zenn記事を同期
async function syncZennPosts() {
  const posts = getAllPosts()
  const zennPosts = posts.filter(post => 
    !post.draft && 
    post.publish_on.includes('zenn')
  )

  log(`${zennPosts.length}件のZenn記事を同期します`, 'info')

  // articlesディレクトリを作成
  if (!fs.existsSync(ZENN_ARTICLES_DIR)) {
    fs.mkdirSync(ZENN_ARTICLES_DIR, { recursive: true })
  }

  for (const post of zennPosts) {
    const zennPost = generateZennPost(post)
    const filePath = path.join(ZENN_ARTICLES_DIR, zennPost.filename)
    
    if (DRY_RUN) {
      log(`[DRY RUN] Zenn記事を生成: ${zennPost.filename}`, 'info')
    } else {
      fs.writeFileSync(filePath, zennPost.content)
      log(`Zenn記事を生成しました: ${zennPost.filename}`, 'success')
    }
  }
}

// Git操作
function commitAndPush() {
  if (DRY_RUN) {
    log('[DRY RUN] Git操作をスキップします', 'info')
    return
  }

  try {
    // Git設定
    execSync('git config user.name "GitHub Actions"', { cwd: ZENN_DIR })
    execSync('git config user.email "actions@github.com"', { cwd: ZENN_DIR })

    // 変更をステージング
    execSync('git add .', { cwd: ZENN_DIR })

    // コミット
    const commitMessage = `Sync articles from main blog - ${new Date().toISOString()}`
    execSync(`git commit -m "${commitMessage}"`, { cwd: ZENN_DIR })

    // プッシュ
    execSync('git push origin main', { cwd: ZENN_DIR })
    
    log('Zennリポジトリへのプッシュが完了しました', 'success')
  } catch (error) {
    log(`Git操作エラー: ${error.message}`, 'error')
    throw error
  }
}

// クリーンアップ
function cleanup() {
  if (fs.existsSync(ZENN_DIR)) {
    fs.rmSync(ZENN_DIR, { recursive: true, force: true })
    log('一時ディレクトリを削除しました', 'info')
  }
}

// メイン処理
async function main() {
  log('Zenn同期処理を開始します...', 'info')
  
  if (DRY_RUN) {
    log('DRY RUNモードで実行中...', 'info')
  }

  try {
    // SSH設定
    setupSSH()
    
    // Zennリポジトリをクローン
    cloneZennRepo()
    
    // 記事を同期
    await syncZennPosts()
    
    // Git操作
    commitAndPush()
    
    log('Zenn同期処理が完了しました', 'success')
  } catch (error) {
    log(`Zenn同期処理でエラーが発生しました: ${error.message}`, 'error')
    process.exit(1)
  } finally {
    // クリーンアップ
    cleanup()
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
