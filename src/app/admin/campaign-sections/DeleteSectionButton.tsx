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
        if (confirm('Delete this section and all its photos? This cannot be undone.')) action()
      }}
      className="px-5 py-2.5 bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-300 font-semibold rounded-xl text-sm transition-colors"
    >
      Delete Section
    </button>
  )
}
