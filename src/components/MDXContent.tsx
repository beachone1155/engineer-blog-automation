import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

interface MDXContentProps {
  content: string
}

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-slate prose-lg max-w-none">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: 'github-dark',
                  keepBackground: false,
                  defaultLang: 'plaintext',
                },
              ],
            ],
          },
        }}
      />
    </div>
  )
}
