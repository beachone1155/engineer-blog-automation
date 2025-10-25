import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Engineer Blog',
    template: '%s | Engineer Blog',
  },
  description: 'エンジニアの技術ブログ - 自動化、開発、学習記録',
  keywords: ['エンジニア', '技術ブログ', 'プログラミング', '自動化', '開発'],
  authors: [{ name: 'Engineer Blog' }],
  creator: 'Engineer Blog',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://engineer-blog-automation.vercel.app',
    siteName: 'Engineer Blog',
    title: 'Engineer Blog',
    description: 'エンジニアの技術ブログ - 自動化、開発、学習記録',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Engineer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineer Blog',
    description: 'エンジニアの技術ブログ - 自動化、開発、学習記録',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
