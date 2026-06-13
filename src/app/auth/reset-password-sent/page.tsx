export const metadata = { title: 'Check Your Email' }

export default function ResetPasswordSentPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-kp-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-kp-surface border border-kp-border rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✉</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Check Your Email</h1>
        <p className="text-gray-400 mb-6 leading-relaxed">
          If an account exists for that email address, we&apos;ve sent a link to reset your password.
          Check your inbox (and spam folder).
        </p>
        <a
          href="/login"
          className="inline-block border border-kp-border text-gray-400 px-6 py-2.5 rounded-lg text-sm hover:border-kp-gold hover:text-kp-gold transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
