'use client'

export default function DeleteEternalButton({ action }: { action: () => void | Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium rounded-lg border border-red-700 text-red-400 hover:bg-red-900/30 transition-colors"
        onClick={e => {
          if (!confirm('Remove this entry from the memorial? This cannot be undone.')) e.preventDefault()
        }}
      >
        Remove Entry
      </button>
    </form>
  )
}
