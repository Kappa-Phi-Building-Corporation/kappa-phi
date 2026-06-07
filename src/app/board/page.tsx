import BoardClient from './BoardClient'

export const metadata = { title: 'Board Members' }

export default function BoardPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Page hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Leadership</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Board Members</h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            The officers and directors of the Kappa Phi Building Corporation, committed to supporting Epsilon Nu.
            Click any member to view their full biography and goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <BoardClient />
      </div>
    </div>
  )
}
