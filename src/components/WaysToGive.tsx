// The CauseVox / PayPal / Venmo / Check cards for /donations. `campaignGiveUrl`
// comes from site_content (Admin → Capital Campaign & Giving Levels) so it
// always matches the link used on the Campaign page.
export default function WaysToGive({ campaignGiveUrl }: { campaignGiveUrl: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-kp-surface border border-kp-gold/40 rounded-2xl overflow-hidden text-center">
        <div className="bg-kp-blue px-5 py-3.5">
          <h3 className="text-kp-gold font-bold">Capital Campaign</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-400 text-sm mb-5">Give toward the Shelter renovation</p>
          <a
            href={campaignGiveUrl}
            target="_blank" rel="noopener noreferrer"
            className="inline-block bg-kp-gold text-black font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm no-underline"
          >
            Donate Online
          </a>
        </div>
      </div>

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
  )
}
