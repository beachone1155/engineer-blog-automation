#!/usr/bin/env node

/**
 * 型安全: Frontmatterの型定義を検証するスクリプト
 * 欠落時はビルドエラーになるように必須フィールドを明示
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設定
const CONTENT_DIR = path.join(__dirname, '..', 'content')

// ログ: 検証結果を明確にログ
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

// 型安全: Frontmatter検証用の型ガード関数
function isValidPostFrontmatter(data, filePath) {
  const errors = []
  
  // 必須フィールドのチェック
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('title フィールドが必須です')
  }
  
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) {
    errors.push('slug フィールドが必須です')
  }
  
  if (!data.summary || typeof data.summary !== 'string' || data.summary.trim().length === 0) {
    errors.push('summary フィールドが必須です')
  }
  
  if (!Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === 'string')) {
    errors.push('tags フィールドは文字列の配列である必要があります')
  }
  
  if (!data.lang || typeof data.lang !== 'string' || data.lang.trim().length === 0) {
    errors.push('lang フィールドが必須です')
  }
  
  if (!Array.isArray(data.publish_on) || !data.publish_on.every(platform => 
    ['qiita', 'zenn', 'devto'].includes(platform)
  )) {
    errors.push('publish_on フィールドは有効なプラットフォームの配列である必要があります')
  }
  
  if (typeof data.draft !== 'boolean') {
    errors.push('draft フィールドはbooleanである必要があります')
  }
  
  if (!data.created_at || typeof data.created_at !== 'string' || data.created_at.trim().length === 0) {
    errors.push('created_at フィールドが必須です')
  }
  
  // 日付形式の検証
  if (data.created_at && !/^\d{4}-\d{2}-\d{2}$/.test(data.created_at)) {
    errors.push('created_at は YYYY-MM-DD 形式である必要があります')
  }
  
  if (data.updated_at && !/^\d{4}-\d{2}-\d{2}$/.test(data.updated_at)) {
    errors.push('updated_at は YYYY-MM-DD 形式である必要があります')
  }
  
  if (errors.length > 0) {
    log(`Frontmatter検証エラー (${filePath}):`, 'error')
    errors.forEach(error => log(`  - ${error}`, 'error'))
    return false
  }
  
  return true
}

// 記事ファイルを検証
function validatePosts() {
  const posts = []
  let errorCount = 0
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (item.endsWith('.md')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        const relativePath = path.relative(CONTENT_DIR, fullPath)
        
        if (!isValidPostFrontmatter(data, relativePath)) {
          errorCount++
        } else {
          log(`Frontmatter検証成功: ${relativePath}`, 'success')
        }
        
        posts.push({ path: relativePath, data })
      }
    }
  }
  
  scanDirectory(CONTENT_DIR)
  
  log(`検証完了: ${posts.length}件の記事を検証`, 'info')
  
  if (errorCount > 0) {
    log(`エラー: ${errorCount}件の記事でFrontmatter検証に失敗しました`, 'error')
    process.exit(1)
  } else {
    log('すべての記事のFrontmatter検証が成功しました', 'success')
  }
}

// メイン処理
function main() {
  log('Frontmatter検証を開始します...', 'info')
  
  try {
    validatePosts()
  } catch (error) {
    log(`検証処理でエラーが発生しました: ${error.message}`, 'error')
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
main()
