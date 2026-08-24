import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import type { Components } from 'react-markdown'

// Standard Markdown has no underline syntax. The rich-text editor emits it
// as a raw <u> tag, so we parse embedded HTML (rehype-raw) but immediately
// sanitize it down to just that one extra tag — every other raw HTML
// element is stripped, so this doesn't reopen arbitrary-HTML injection.
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'u'],
}

const components: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  u: ({ children }) => <u>{children}</u>,
  a: ({ href, children }) => {
    const external = href?.startsWith('http')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-kp-gold hover:underline"
      >
        {children}
      </a>
    )
  },
  ul: ({ children }) => <ul className="list-disc list-outside pl-5 space-y-1 mb-3 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside pl-5 space-y-1 mb-3 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  h1: ({ children }) => <h3 className="text-white font-bold text-lg mb-2 mt-4 first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="text-white font-bold text-base mb-2 mt-4 first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="text-white font-bold text-sm mb-1.5 mt-3 first:mt-0">{children}</h4>,
}

export function Markdown({ body, className = '' }: { body: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
