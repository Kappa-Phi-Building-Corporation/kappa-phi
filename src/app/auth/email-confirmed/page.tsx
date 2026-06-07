export const metadata = { title: 'Email Confirmed' }

export default async function EmailConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const isError = !!error

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {isError ? (
          <>
            <div className="w-16 h-16 bg-red-900/40 border border-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Link Invalid or Expired</h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              This confirmation link has already been used or has expired.
              If you need a new link, try registering again.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-900/40 border border-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Email Confirmed!</h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your email has been verified. The site administrator has been notified and will
              review your account shortly.
            </p>
          </>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 text-sm text-gray-400 text-left space-y-2">
          <p className="font-semibold text-white">What happens next?</p>
          <p>The administrator will approve your account and you will be able to log in and access the alumni portal.</p>
          <p>
            For questions, contact{' '}
            <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">
              kappaphi@kappa-phi.org
            </a>.
          </p>
        </div>

        <a
          href="/login"
          className="inline-block mt-6 border border-kp-border text-gray-400 px-6 py-2.5 rounded-lg text-sm hover:border-kp-gold hover:text-kp-gold transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
