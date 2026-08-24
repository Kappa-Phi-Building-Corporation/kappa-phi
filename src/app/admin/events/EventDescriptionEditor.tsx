'use client'

import { useState } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Markdown } from 'tiptap-markdown'

// tiptap-markdown's types don't declaration-merge into Tiptap's Storage
// interface, so TypeScript doesn't know editor.storage.markdown exists.
function getMarkdown(editor: Editor): string {
  return (editor.storage as unknown as { markdown: { getMarkdown(): string } }).markdown.getMarkdown()
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
        active ? 'bg-kp-gold text-black' : 'text-gray-300 hover:bg-kp-card'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-kp-border bg-kp-dark rounded-t-xl">
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span className="underline">U</span>
      </ToolbarButton>
      <div className="w-px h-5 bg-kp-border mx-1" />
      <ToolbarButton
        label="Larger heading"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Smaller heading"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <div className="w-px h-5 bg-kp-border mx-1" />
      <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M4 6h1v2M4 10h2l-2 2.5h2M4 16h2v2H4v-2z" />
        </svg>
      </ToolbarButton>
      <div className="w-px h-5 bg-kp-border mx-1" />
      <ToolbarButton
        label="Link"
        active={editor.isActive('link')}
        onClick={() => {
          const url = window.prompt('Link URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
          else if (url === '') editor.chain().focus().unsetLink().run()
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </ToolbarButton>
    </div>
  )
}

export default function EventDescriptionEditor({
  name,
  initialValue,
}: {
  name: string
  initialValue: string
}) {
  const [markdown, setMarkdown] = useState(initialValue)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Markdown.configure({ html: false, tightLists: true, linkify: false }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'prose-sm max-w-none min-h-[160px] px-4 py-3 text-white text-sm leading-relaxed focus:outline-none [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-kp-gold [&_a]:underline',
      },
    },
    onUpdate: ({ editor }) => setMarkdown(getMarkdown(editor)),
  })

  if (!editor) {
    return (
      <div className="bg-kp-dark border border-kp-border rounded-xl min-h-[204px] flex items-center justify-center text-gray-600 text-sm">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="border border-kp-border rounded-xl overflow-hidden bg-kp-dark">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={markdown} readOnly />
    </div>
  )
}
