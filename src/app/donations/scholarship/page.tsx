import Link from 'next/link'

export const metadata = { title: 'Byron N. Vermillion Memorial Scholarship — Apply' }

const eligibility = [
  'Complete and submit the scholarship application (contact us to receive it)',
  'Be a full-time student at the Missouri University of Science and Technology',
  'Be pledged to join, or already be a member in good standing of, the Epsilon Nu Chapter of Delta Tau Delta',
  'Reside within the shelter, an approved annex, or be an out-of-house pledge',
  'Show demonstrated financial need (include a copy of current FAFSA / MS&T scholarship status)',
]

export default function ScholarshipPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Scholarship</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Byron N. Vermillion<br />Memorial Scholarship
          </h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            Information, eligibility, and how to apply.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* About */}
        <section className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">About the Scholarship</div>
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>
              The scholarship was established in honor of Byron N. Vermillion, Epsilon Nu&apos;s first alumni
              advocate and advisor. From the beginning, Byron did everything he could to help advance Delta
              Tau Delta and its undergraduates. We continue on this path today in the form of this scholarship.
            </p>
            <p>
              Donations are made to the fund by alumni and are made available annually through the Miner
              Alumni Association. Kappa Phi Building Corporation is informed of the available distribution
              amount, which has traditionally been between $1,000–$1,500 total. This amount depends on
              economic factors and donations received, which are outside our control.
            </p>
            <p>
              In recent years, the board has awarded an average of two scholarships per year at approximately
              $600 each. The board may award up to three separate scholarships depending on the number of
              applicants, eligibility, and available funds.
            </p>
          </div>
          <div className="mt-5 pt-5 border-t border-kp-border">
            <Link href="/donations/byron" className="text-kp-gold text-sm hover:opacity-80 no-underline">
              Learn more about Byron N. Vermillion →
            </Link>
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Eligibility Requirements</div>
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6">
            <ul className="space-y-3">
              {eligibility.map((item, i) => (
                <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                  <span className="text-kp-gold mt-0.5 shrink-0">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-kp-border">
              <p className="text-gray-500 text-xs leading-relaxed">
                While personal financial information is requested, it is used solely to determine eligibility and
                rank applicants. All information is handled securely and is not stored or shared after the board
                makes its eligibility determination. If an applicant omits information that assists in establishing
                eligibility, the Scholarship Board reserves the right to favor more qualified candidates or reject
                the application.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">The Process</div>
          <div className="bg-kp-surface border border-kp-border rounded-2xl divide-y divide-kp-border overflow-hidden">
            {[
              {
                step: '01',
                title: 'Applications open',
                body: 'Shortly after the beginning of the fall semester and before homecoming, all scholarship applications are distributed and reviewed by the scholarship board.',
              },
              {
                step: '02',
                title: 'Board review',
                body: 'The board reviews all applications, evaluates eligibility, and selects recipients. Up to three separate awards may be given depending on the applicant pool and available funds.',
              },
              {
                step: '03',
                title: 'Notification',
                body: 'Recipients are notified directly by a member of the scholarship board. Notification is also sent to the Miner Alumni Association so distribution letters can be processed.',
              },
              {
                step: '04',
                title: 'Funds disbursed',
                body: 'The award is automatically credited to the recipient\'s MST student account, provided the student picks up their scholarship materials at the Alumni Office at the requested time.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-5 p-6">
                <div className="text-kp-gold font-black text-xl tabular-nums shrink-0 w-8">{step}</div>
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{title}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Apply CTA */}
        <section className="bg-kp-blue rounded-2xl p-8">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Questions &amp; Applications</div>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            To request an application or ask questions about the process, reach out to the scholarship board directly.
            Peter Moore, KPBC President, serves as Director of the Byron Vermillion Memorial Scholarship.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
              <a href="mailto:scholarship@kappa-phi.org" className="text-kp-gold font-semibold hover:opacity-80 no-underline">
                scholarship@kappa-phi.org
              </a>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
              <a href="tel:6365783121" className="text-white font-semibold hover:text-kp-gold no-underline">
                (636) 578-3121
              </a>
              <p className="text-gray-500 text-xs mt-0.5">VP&apos;s Cell</p>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div>
          <Link href="/donations" className="text-gray-500 hover:text-kp-gold text-sm transition-colors no-underline">
            ← Back to Donations
          </Link>
        </div>

      </div>
    </div>
  )
}
