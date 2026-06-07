export const metadata = { title: 'Check Your Email' }

export default function CheckEmailPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-kp-surface border border-kp-border rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✉</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Check Your Email</h1>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We sent a confirmation link to your email address. Click the link to verify your account.
        </p>
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 text-left space-y-3 text-sm text-gray-300">
          <p className="flex gap-3">
            <span className="text-kp-gold shrink-0">1.</span>
            Check your inbox (and spam folder) for an email from Kappa Phi BC.
          </p>
          <p className="flex gap-3">
            <span className="text-kp-gold shrink-0">2.</span>
            Click the confirmation link in that email.
          </p>
          <p className="flex gap-3">
            <span className="text-kp-gold shrink-0">3.</span>
            The site administrator will be notified to approve your account.
          </p>
          <p className="flex gap-3">
            <span className="text-kp-gold shrink-0">4.</span>
            Once approved, you can log in and access the alumni portal.
          </p>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          Need help?{' '}
          <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">
            kappaphi@kappa-phi.org
          </a>
        </p>
      </div>
    </div>
  )
}
