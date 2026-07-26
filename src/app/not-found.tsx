import Link from 'next/link'

export const metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-kp-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-kp-gold font-black text-lg">ΔΤΔ</span>
        </div>
        <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">404</div>
        <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-kp-gold text-black font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
