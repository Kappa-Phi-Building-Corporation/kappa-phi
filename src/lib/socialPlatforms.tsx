export const SOCIAL_PLATFORMS: { value: string; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
]

export function SocialIcon({ platform, className = 'w-4 h-4' }: { platform: string; className?: string }) {
  switch (platform) {
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={1.7} />
          <circle cx="12" cy="12" r="4" strokeWidth={1.7} />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'x':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.9 2H22l-7.4 8.5L23.2 22h-6.9l-5.4-6.9L4.7 22H1.6l7.9-9.1L1 2h7.1l4.9 6.3zm-1.2 18h1.9L7.4 4H5.4z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23 12s0-3.5-.45-5.2a2.9 2.9 0 00-2-2C18.9 4.3 12 4.3 12 4.3s-6.9 0-8.55.5a2.9 2.9 0 00-2 2C1 8.5 1 12 1 12s0 3.5.45 5.2a2.9 2.9 0 002 2c1.65.5 8.55.5 8.55.5s6.9 0 8.55-.5a2.9 2.9 0 002-2C23 15.5 23 12 23 12zM9.8 15.5v-7l6 3.5z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9.5 9H13v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.45 2.4 4.45 5.6V21h-4v-5.6c0-1.35-.02-3.1-1.9-3.1-1.9 0-2.2 1.5-2.2 3v5.7h-4z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 2h-3v13.6a2.9 2.9 0 11-2.4-2.85V9.6a6 6 0 104.9 5.9V8.3a7.6 7.6 0 004.5 1.45v-3a4.6 4.6 0 01-4-4.75z" />
        </svg>
      )
    case 'website':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" strokeWidth={1.7} />
          <path strokeLinecap="round" strokeWidth={1.7} d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
            d="M13.83 10.17a4 4 0 00-5.66 0l-4 4a4 4 0 105.66 5.66l1.1-1.1M10.17 13.83a4 4 0 005.66 0l4-4a4 4 0 00-5.66-5.66l-1.1 1.1" />
        </svg>
      )
  }
}
