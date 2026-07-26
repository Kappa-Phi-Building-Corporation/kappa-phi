'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-kp-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-kp-gold font-black text-lg">ΔΤΔ</span>
        </div>
        <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Error</div>
        <h1 className="text-4xl font-black text-white mb-4">Something Went Wrong</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Please try again, or email{' '}
          <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">kappaphi@kappa-phi.org</a>{' '}
          if it keeps happening.
        </p>
        <button
          onClick={() => reset()}
          className="bg-kp-gold text-black font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
