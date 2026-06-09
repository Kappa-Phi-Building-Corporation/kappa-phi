// Server-side only — never import this in a client component.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const zips = require('zipcodes') as {
  lookup: (zip: string) => { latitude: number; longitude: number } | undefined
  lookupByName: (city: string, state: string) => Array<{ latitude: number; longitude: number }>
}

export interface GeoCoords {
  lat: number
  lng: number
}

type AddressFields = {
  address_street?: string | null
  address_city?: string | null
  address_state?: string | null
  address_zip?: string | null
}

// ── Full address geocoding via US Census Bureau (free, no API key) ────────────
// Returns street-level precision for US addresses.
async function geocodeFullAddress(m: AddressFields): Promise<GeoCoords | null> {
  if (!m.address_street) return null
  if (!m.address_city && !m.address_zip) return null

  const params = new URLSearchParams({ benchmark: 'Public_AR_Current', format: 'json' })
  params.set('street', m.address_street)
  if (m.address_city)  params.set('city', m.address_city)
  if (m.address_state) params.set('state', m.address_state)
  if (m.address_zip)   params.set('zip', m.address_zip.trim().slice(0, 5))

  try {
    const res = await fetch(
      `https://geocoding.geo.census.gov/geocoder/locations/address?${params}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return null
    const json = await res.json()
    const coord = json?.result?.addressMatches?.[0]?.coordinates
    if (coord?.x && coord?.y) return { lat: coord.y, lng: coord.x }
  } catch {
    // API unavailable or timed out — fall through to local fallback
  }
  return null
}

// ── Synchronous fallback: zip code → city/state (local database, instant) ────
export function geocodeFallback(m: AddressFields): GeoCoords | null {
  if (m.address_zip) {
    const info = zips.lookup(m.address_zip.trim().slice(0, 5))
    if (info?.latitude && info?.longitude) return { lat: info.latitude, lng: info.longitude }
  }
  if (m.address_city && m.address_state) {
    const results = zips.lookupByName(m.address_city, m.address_state)
    if (results?.[0]?.latitude && results?.[0]?.longitude)
      return { lat: results[0].latitude, lng: results[0].longitude }
  }
  return null
}

// ── Full geocoding chain: street address → zip → city/state ──────────────────
// Use this when storing to the database (admin member saves).
// Falls back gracefully so the chain always resolves.
export async function geocodeMemberFull(m: AddressFields): Promise<GeoCoords | null> {
  if (m.address_street) {
    const coords = await geocodeFullAddress(m)
    if (coords) return coords
  }
  return geocodeFallback(m)
}
