export const metadata = { title: 'Donations & Fundraising' }

export default function DonationsPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Give Back</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Donations &amp; Fundraising</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Your generosity keeps the Shelter strong and supports the next generation of Epsilon Nu brothers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Letter */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <p className="text-gray-200 leading-relaxed mb-4">
            Brothers, Epsilon Nu would not be where it is today without selfless acts of generosity. From our founding
            as a colony as Kappa Phi to where we are today, our Brothers striving to live Lives of Excellence has
            driven us forward and created a shelter we can be proud of.
          </p>
          <p className="text-gray-300 leading-relaxed mb-5">
            The mission isn&apos;t over. We need your time, talent, and treasure to continue the work Epsilon Nu does
            to turn young men into successful leaders of tomorrow. Please continue to be generous and give back to our
            beloved shelter.
          </p>
          <div className="border-t border-kp-border pt-5">
            <p className="text-kp-gold font-semibold">Adam Rice &mdash; VP of Fundraising</p>
            <a href="mailto:fundraising@kappa-phi.org" className="text-gray-400 text-sm hover:text-kp-gold">
              fundraising@kappa-phi.org
            </a>
            <span className="text-gray-600 text-sm"> · 573-514-3016</span>
          </div>
        </div>

        {/* Ways to give */}
        <div>
          <h2 className="text-white font-bold text-2xl mb-6">Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden text-center">
              <div className="bg-kp-blue px-5 py-3.5">
                <h3 className="text-kp-gold font-bold">PayPal</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-5">One-time or recurring donations</p>
                <a
                  href="https://www.paypal.com/donate?hosted_button_id=RRHFP9PRAJW4G"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-kp-gold text-black font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm no-underline"
                >
                  Donate via PayPal
                </a>
              </div>
            </div>

            <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden text-center">
              <div className="bg-kp-blue px-5 py-3.5">
                <h3 className="text-kp-gold font-bold">Venmo</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-5">One-time donations</p>
                <a
                  href="https://venmo.com/u/KappaPhiBuildingCorp"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-kp-gold text-black font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm no-underline"
                >
                  @KappaPhiBuildingCorp
                </a>
              </div>
            </div>

            <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
              <div className="bg-kp-blue px-5 py-3.5">
                <h3 className="text-kp-gold font-bold">Check</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-3">Payable to Kappa Phi Building Corporation:</p>
                <address className="not-italic text-gray-300 text-sm space-y-0.5">
                  <p>Kappa Phi Building Corporation</p>
                  <p>VP of Fundraising</p>
                  <p>117 Fairburn Dr.</p>
                  <p>Rolla, MO 65401</p>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship */}
        <div className="bg-kp-blue-dark rounded-2xl p-8">
          <h2 className="text-kp-gold font-black text-2xl mb-2">Byron N. Vermillion Memorial Scholarship Fund</h2>
          <p className="text-blue-100 leading-relaxed mb-6">
            Donations to the Vermillion Scholarship Fund are <strong className="text-white">tax deductible</strong>.
            Support a deserving brother in their academic journey at Missouri S&T.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/donations/byron"
              className="inline-block bg-kp-gold text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm no-underline"
            >
              Donate to the Scholarship
            </a>
            <a
              href="/donations/scholarship"
              className="inline-block border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:border-kp-gold hover:text-kp-gold transition-colors text-sm no-underline"
            >
              Apply for the Scholarship
            </a>
          </div>
          <p className="text-blue-300 text-xs mt-4">
            Donations to the Kappa Phi Building Corporation are <em>not</em> tax deductible.
            Donations to the Byron Vermillion Scholarship Fund <em>are</em> tax deductible.
          </p>
        </div>
      </div>
    </div>
  )
}
