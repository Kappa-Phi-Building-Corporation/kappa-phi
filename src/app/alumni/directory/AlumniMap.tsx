'use client'

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { DirectoryMember } from './AlumniDirectory'

export type GeoMember = DirectoryMember & { lat: number; lng: number }

// Crimson teardrop with gold inner dot — matches site branding
function makeIcon(fill: string) {
  return L.divIcon({
    html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
      <path fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1"
        d="M11 0C4.925 0 0 4.925 0 11c0 7.5 11 19 11 19s11-11.5 11-19C22 4.925 17.075 0 11 0z"/>
      <circle fill="#C8A400" cx="11" cy="11" r="4"/>
    </svg>`,
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    tooltipAnchor: [0, -30],
    className: '',
  })
}

const PIN     = makeIcon('#9B2335')
const PIN_SEL = makeIcon('#4a0d14')

// Custom cluster icon that fits the site palette
function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount()
  const size  = count < 10 ? 32 : count < 50 ? 38 : 44
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;line-height:${size}px;
      background:#9B2335;color:#C8A400;
      border:2px solid #C8A400;border-radius:50%;
      text-align:center;font-size:${size < 38 ? 12 : 14}px;font-weight:700;
      box-shadow:0 2px 6px rgba(0,0,0,0.5);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: '',
  })
}

export default function AlumniMap({
  members,
  selected,
  onSelect,
}: {
  members: GeoMember[]
  selected: DirectoryMember | null
  onSelect: (m: GeoMember) => void
}) {
  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      />
      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
        {members.map(m => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={selected?.id === m.id ? PIN_SEL : PIN}
            eventHandlers={{ click: () => onSelect(m) }}
          >
            <Tooltip direction="top">
              <div className="text-xs leading-snug">
                <strong>{[m.first_name, m.last_name].filter(Boolean).join(' ')}</strong>
                <br />
                {[m.address_city, m.address_state].filter(Boolean).join(', ')}
                {m.pledge_class && (
                  <><br /><span className="text-gray-500">{m.pledge_class}</span></>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
