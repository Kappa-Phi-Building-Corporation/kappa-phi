'use client'

export default function DeleteSectionButton({
  action,
}: {
  action: () => void | Promise<void>
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm('Delete this section from the guide? This cannot be undone.')) action()
      }}
      className="px-4 py-2 rounded-xl border border-red-800 text-red-400 text-sm hover:bg-red-950/40 transition-colors"
    >
      Delete Section
    </button>
  )
}
