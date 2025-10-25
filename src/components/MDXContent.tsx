import { MDXRemote } from 'next-mdx-remote/rsc'

interface MDXContentProps {
  content: string
}

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {},
        }}
      />
    </div>
  )
}
