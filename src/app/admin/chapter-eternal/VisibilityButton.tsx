'use client'

export default function VisibilityButton({
  isHidden,
  showAction,
  hideAction,
}: {
  isHidden: boolean
  showAction: () => void | Promise<void>
  hideAction: () => void | Promise<void>
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const msg = isHidden
          ? 'Show this entry on the public memorial page?'
          : 'Hide this entry from the public memorial page?'
        if (confirm(msg)) (isHidden ? showAction : hideAction)()
      }}
      className={`shrink-0 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
        isHidden
          ? 'border-kp-border text-gray-500 hover:border-green-700 hover:text-green-400'
          : 'border-green-700/50 text-green-400 hover:border-red-700 hover:text-red-400'
      }`}
    >
      {isHidden ? 'Hidden' : 'Visible'}
    </button>
  )
}
