'use client'

import { useState } from 'react'
import Image from 'next/image'

// A small clickable thumbnail that opens the full image in an overlay.
// The overlay box has a fixed size but uses object-contain, so it
// letterboxes correctly regardless of the source image's actual aspect
// ratio — no cropping, and no need to know the image's real dimensions.
export function ImageLightboxThumbnail({
  src,
  alt,
  className = 'relative w-20 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border border-kp-border bg-kp-card',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View full image: ${alt}`}
        className={`${className} group`}
      >
        <Image src={src} alt={alt} fill sizes="140px" className="object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <svg
            className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-[92vw] h-[85vh] max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            <Image src={src} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
