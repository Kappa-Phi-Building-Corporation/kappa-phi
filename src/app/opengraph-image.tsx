import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D0000 0%, #4D0000 55%, #1C3168 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            fontWeight: 700,
            color: '#C8A028',
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          Epsilon Nu · Delta Tau Delta · Missouri S&amp;T
        </div>
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 900, color: 'white', lineHeight: 1.05 }}>
          Kappa Phi
        </div>
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 900, color: '#C8A028', lineHeight: 1.05 }}>
          Building Corp.
        </div>
      </div>
    ),
    { ...size }
  )
}
