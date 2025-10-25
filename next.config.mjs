import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false,
  },
  // GitHub Pages用の設定（環境変数で制御）
  ...(process.env.DEPLOY_TARGET === 'github-pages' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  // Vercel用の設定（デフォルト）
  ...(process.env.DEPLOY_TARGET !== 'github-pages' && {
    images: {
      domains: ['images.unsplash.com'],
    },
  }),
}

// シンプルなMDX設定（両プラットフォーム対応）
const mdxConfig = {
  remarkPlugins: [],
  rehypePlugins: [],
}

export default createMDX(mdxConfig)(nextConfig)
