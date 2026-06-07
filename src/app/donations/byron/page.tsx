import Link from 'next/link'

export const metadata = { title: 'Byron N. Vermillion Memorial Scholarship Fund' }

const faq = [
  {
    q: 'How will my donations be used?',
    a: 'All donations to the scholarship fund will be used to award scholarships to undergraduate Delts attending the Missouri University of Science and Technology.',
  },
  {
    q: 'How are disbursements awarded?',
    a: 'The recipient(s) shall be selected by the Board of Directors of Kappa Phi Building Corporation. Qualified applicants must be undergraduate members of Epsilon Nu Chapter of Delta Tau Delta in good standing with both the international fraternity and the chapter, and currently enrolled at Missouri S&T. Preference is given to applicants who strongly exhibit qualities consistent with the mission and values of Delta Tau Delta Fraternity.',
  },
  {
    q: 'How are the funds invested, and are contributions tax deductible?',
    a: 'For investment purposes only, monies in this fund may be commingled with other funds of the Miner (formerly MSM-UMR) Alumni Association. This fund was established through the Miner Alumni Association as a tax-deductible fund and donations you make may qualify. Please consult with the Miner Alumni Association and a tax professional.',
  },
  {
    q: 'How do I donate to the fund?',
    a: 'You can mail a check to the Miner Alumni Association (see mailing address below), or donate online through <a href="https://give.mst.edu" target="_blank" rel="noopener noreferrer">Missouri S&T\'s Online Giving portal</a>. When donating online, select "Other" for the fund, enter your donation amount, and put "Delta Tau Delta - Byron N. Vermillion Memorial Scholarship Fund" in the designation field.',
  },
  {
    q: 'If I pay by check, who do I make it payable to?',
    a: 'Checks should be made out to the Miner Alumni Association, with a note that it is for the Delta Tau Delta - Byron N. Vermillion Scholarship Fund.',
  },
  {
    q: 'Can donations be made through methods other than online or check?',
    a: 'Yes. The Association accepts stocks for transfer and sale; major credit cards for one-time or automatic recurring gifts (quarterly, monthly, etc.); and arrangements can be made for direct debit of checking accounts. Contact the Miner Alumni Association office directly to set these up.',
  },
  {
    q: 'How are contributions acknowledged?',
    a: 'Each donor receives a thank-you acknowledgment letter from the alumni association approximately two weeks after donations are received. Please note that Kappa Phi and the chapter are not regularly informed about individual contributions, and information regarding donations is not disclosed unless the donor agrees in advance.',
  },
  {
    q: 'How will donations be applied toward lifetime giving?',
    a: 'Gifts to this fund are credited to alumni and friends as part of their lifetime giving to MST and/or the Miner Alumni Association. Kappa Phi Building Corporation will also make every attempt to credit donations toward lifetime gifts to Kappa Phi.',
  },
  {
    q: 'What is the investment strategy for the funds?',
    a: 'Returns are the same as the general scholarship fund for Missouri S&T — typically 6–8% on average over long periods of time.',
  },
  {
    q: 'What are the procedures for awarding scholarships?',
    a: 'A Kappa Phi Building Corporation representative notifies the Alumni Office and the Student Financial Aid Office of the selected student and the semester(s) for the award. Funds are automatically credited to the student\'s MST account, provided the student picks up scholarship materials at the Alumni Office at the requested time. Selection criteria and application procedures are at the discretion of the Kappa Phi Building Corporation.',
  },
  {
    q: 'Where can I find the scholarship application?',
    a: 'Applicants should visit the scholarship information page for details and a copy of the application form.',
  },
  {
    q: 'What if I have other questions?',
    a: 'Questions can be directed to the Miner Alumni Association at the address below, or emailed to the entire Board of Directors at scholarship@kappa-phi.org.',
  },
]

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function ByronPage() {
  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">In Memoriam</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Byron N. Vermillion</h1>
          <p className="text-gray-400 text-lg">1948 &ndash; 2000 &nbsp;·&nbsp; Alpha Pledge Class &nbsp;·&nbsp; Badge #9</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* Memorial bio */}
        <section>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <p className="text-gray-200 leading-relaxed">
                Byron Vermillion was a Charter Member of Kappa Phi, part of the Alpha pledge class and the Ninth
                badge of the Epsilon Nu Chapter of Delta Tau Delta, initiated on December 10, 1968.
              </p>
              <p className="text-gray-300 leading-relaxed">
                As a member of early Kappa Phi and later as a Delt, Byron always cared about his fellow brothers
                and the direction of the chapter. He truly donated his time, talents, and treasure for our betterment.
              </p>
              <p className="text-gray-300 leading-relaxed">
                As an alumnus, Byron served for several years as Chapter Advisor and a very active member of
                the Kappa Phi Building Corporation. He was an essential part of the team responsible for the 1999
                expansion of the shelter. Byron provided great insight, was a stickler for details, and was always
                the advocate for providing future Delts at Epsilon Nu — <em className="text-white">&ldquo;My Safest Shelter.&rdquo;</em>
              </p>
              <p className="text-gray-300 leading-relaxed">
                Although Byron was able to see the groundbreaking and the finished product of his labor, he joined
                the Chapter Eternal at the young age of 52. On September 19, 2000, Byron was killed in a tragic
                automobile accident along Interstate 44 near Pacific, Missouri. His pledge beanie cap was personally
                donated at his last homecoming, sealed in the chapter&apos;s time capsule.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Byron is survived by his wife Terry and their two children.
              </p>
              <p className="text-kp-gold font-semibold italic">&ldquo;My Brother, your work is done.&rdquo;</p>
            </div>

            {/* Photo */}
            <div className="w-full md:w-56 shrink-0">
              <img
                src="/images/byron/byron-vermillion.jpg"
                alt="Byron N. Vermillion"
                className="w-full rounded-2xl object-cover object-top border border-kp-border"
              />
              <p className="text-gray-600 text-xs text-center mt-2">Byron N. Vermillion</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-kp-border" />

        {/* Scholarship fund section */}
        <section>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Memorial Scholarship</div>
          <h2 className="text-white text-2xl font-black mb-4">Byron N. Vermillion Memorial Scholarship Fund</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Byron&apos;s family agreed to allow us to memorialize his life in the form of an annual scholarship
            given in his name. The tax-deductible fund was established in 2002 with the permission of the
            Vermillion family and is sponsored by the Miner Alumni Association of Missouri S&amp;T. Pledges
            and undergraduate Delts can apply for awards based upon financial need, subject to a panel of
            Kappa Phi members.
          </p>

          {/* Mailing address */}
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 mb-8">
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Mail Donations To</div>
            <div className="flex flex-col sm:flex-row gap-8">
              <address className="not-italic text-gray-300 text-sm space-y-1 flex-1">
                <p className="font-semibold text-white">Miner Alumni Association</p>
                <p>Attn: Delta Tau Delta Scholarship Fund</p>
                <p>107 Castleman Hall</p>
                <p>400 W. 10th St.</p>
                <p>Rolla, MO 65409</p>
              </address>
              <div className="text-sm space-y-2 text-gray-300">
                <p>
                  <span className="text-gray-500">Phone: </span>
                  <a href="tel:5733414145" className="hover:text-kp-gold">(573) 341-4145</a>
                </p>
                <p>
                  <span className="text-gray-500">Email: </span>
                  <a href="mailto:alumni@mst.edu" className="hover:text-kp-gold">alumni@mst.edu</a>
                </p>
                <p>
                  <span className="text-gray-500">Scholarship questions: </span>
                  <a href="mailto:scholarship@kappa-phi.org" className="hover:text-kp-gold">scholarship@kappa-phi.org</a>
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Frequently Asked Questions</div>
          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {faq.map((item, i) => (
              <details key={i} className="group border-b border-kp-border last:border-0">
                <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer list-none hover:bg-kp-card transition-colors">
                  <Chevron className="w-4 h-4 text-gray-600 group-open:rotate-180 transition-transform shrink-0" />
                  <span className="text-gray-200 text-sm font-medium">{item.q}</span>
                </summary>
                <div className="px-6 pb-5 pt-1 pl-13">
                  <p
                    className="text-gray-400 text-sm leading-relaxed pl-7"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </div>
              </details>
            ))}
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
