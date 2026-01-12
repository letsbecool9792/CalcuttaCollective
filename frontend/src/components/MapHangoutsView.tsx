import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Hangout } from '../context/AppContext'

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="w-8 h-8 bg-amber-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-amber-700"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

interface MapHangoutsViewProps {
  hangouts: Hangout[]
  areaCenter?: { lat: number; lng: number }
}

export default function MapHangoutsView({ hangouts, areaCenter }: MapHangoutsViewProps) {
  // Calculate center from hangouts if not provided
  const validHangouts = hangouts.filter(h => h.latitude && h.longitude)
  
  const center = areaCenter || (validHangouts.length > 0 
    ? {
        lat: validHangouts.reduce((sum, h) => sum + (h.latitude || 0), 0) / validHangouts.length,
        lng: validHangouts.reduce((sum, h) => sum + (h.longitude || 0), 0) / validHangouts.length
      }
    : { lat: 22.5726, lng: 88.3639 })

  if (validHangouts.length === 0) {
    return (
      <div className="h-96 md:h-125 rounded-lg overflow-hidden border border-stone-300 shadow-md flex items-center justify-center bg-stone-50">
        <p className="text-stone-600">No hangouts with locations to display on map</p>
      </div>
    )
  }

  return (
    <div className="h-96 md:h-125 rounded-lg overflow-hidden border border-stone-300 shadow-md">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validHangouts.map((hangout) => (
          <Marker
            key={hangout.id}
            position={[hangout.latitude!, hangout.longitude!]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2 min-w-50">
                <h3 className="font-bold text-stone-800 mb-1">{hangout.title}</h3>
                <p className="text-sm text-stone-600 mb-2">
                  {new Date(hangout.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at {hangout.time}
                </p>
                <Link
                  to={`/hangout/${hangout.id}`}
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  View Hangout
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
