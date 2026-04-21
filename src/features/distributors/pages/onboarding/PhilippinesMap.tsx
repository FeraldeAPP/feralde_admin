import { memo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { FeatureCollection, Geometry } from 'geojson'
import { PHILIPPINE_CITIES } from './onboarding.data'
import type { City } from './onboarding.data'

export type { City }

const GEOJSON_URL = '/ph-country-lowres.geo.json'
const MAP_CENTER: [number, number] = [12.8797, 121.774]
const MAP_ZOOM = 6

// Philippines bounds — slightly padded
const PH_BOUNDS: L.LatLngBoundsExpression = [
  [4.2, 114.0],   // SW corner
  [21.5, 127.0],  // NE corner
]

function createMarkerIcon(city: City, isSelected: boolean): L.DivIcon {
  const fill   = city.available ? '#ef4444' : '#6b7280'
  const stroke = isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)'
  const sw     = isSelected ? 2 : 0.75
  const size   = isSelected ? 32 : 24

  return L.divIcon({
    className: '',
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));transition:all 0.2s ease;">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
        <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9"/>
      </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  })
}

// ── Locks the map view to Philippines on load ────────────────────────────────
function BoundsLock() {
  const map = useMap()
  useEffect(() => {
    map.setMaxBounds(PH_BOUNDS)
    map.setMinZoom(5)
    map.setMaxZoom(10)
    map.fitBounds(PH_BOUNDS, { padding: [10, 10] })
  }, [map])
  return null
}

// ── Enables zoom only when Ctrl key is held ──────────────────────────────────
function CtrlScrollZoom() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY < 0 ? 1 : -1
        map.setZoom(map.getZoom() + delta)
      }
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [map])
  return null
}

interface Props {
  cities?: City[]
  selectedPin?: string | null
  onPinClick: (city: City) => void
}

const PhilippinesMap = memo(function PhilippinesMap({
  cities = PHILIPPINE_CITIES,
  selectedPin = null,
  onPinClick,
}: Props) {
  const [loading, setLoading] = useState(true)
  const [geojson, setGeojson] = useState<FeatureCollection<Geometry> | null>(null)

  useEffect(() => {
    let dead = false
    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then(d => { if (!dead) { setGeojson(d); setLoading(false) } })
      .catch(() => { if (!dead) setLoading(false) })
    return () => { dead = true }
  }, [])

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-stone-200/50 bg-black"
      style={{ minHeight: 520 }}
    >
      {/* Header label */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="text-[10px] tracking-[0.16em] uppercase text-white/40 font-medium">
          Select your city
        </span>
      </div>

      {/* Hint */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-[11px] text-white/30 whitespace-nowrap">
          Tap a pin to continue
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <span className="text-xs text-white/30 tracking-widest animate-pulse">
            Loading map…
          </span>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ width: '100%', height: '100%', minHeight: 520, background: '#000' }}
        attributionControl={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={true}
        touchZoom={false}
      >
        <BoundsLock />
        <CtrlScrollZoom />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        {geojson && (
          <GeoJSON
            data={geojson}
            style={{
              color: '#ffffff',
              weight: 0.75,
              opacity: 0.6,
              fillColor: '#000',
              fillOpacity: 0,
            }}
          />
        )}
        {!loading && cities.map(city => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={createMarkerIcon(city, selectedPin === city.name)}
            eventHandlers={{ click: () => onPinClick(city) }}
          />
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-1.5 rounded-xl border border-white/10 bg-black/70 backdrop-blur px-3 py-2.5">
        {[
          { color: 'bg-red-500',  label: 'Available'   },
          { color: 'bg-gray-500', label: 'Unavailable' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`size-2 rounded-full ${color}`} />
            <span className="text-[11px] text-white/50 font-bold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

export default PhilippinesMap
