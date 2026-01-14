import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="w-10 h-10 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

interface MapLocationViewProps {
  latitude: number
  longitude: number
  locationName: string
}

export default function MapLocationView({ latitude, longitude, locationName }: MapLocationViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-stone-700">
        <span className="text-lg">📍</span>
        <p className="font-medium">{locationName}</p>
      </div>
      
      <div className="h-64 md:h-80 rounded-lg overflow-hidden border border-stone-300 relative z-0">
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={customIcon} />
        </MapContainer>
      </div>
    </div>
  )
}
