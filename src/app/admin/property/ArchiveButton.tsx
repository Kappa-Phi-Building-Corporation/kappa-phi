'use client'

export default function ArchiveButton({ action }: { action: () => void | Promise<void> }) {
  return (
    <button
      type="button"
      onClick={() => { if (confirm('Move this project to the archive?')) action() }}
      className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-400 hover:border-amber-600 hover:text-amber-400 transition-colors"
    >
      Archive
    </button>
  )
}
