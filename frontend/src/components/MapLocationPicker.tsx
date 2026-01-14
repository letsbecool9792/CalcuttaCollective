import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with Leaflet + Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="w-8 h-8 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

interface MapLocationPickerProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number }
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapLocationPicker({ onLocationSelect, initialLocation }: MapLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  )
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    initialLocation?.lat || 22.5726,
    initialLocation?.lng || 88.3639
  ])
  const mapRef = useRef<any>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&viewbox=88.2,22.7,88.5,22.4&bounded=1`
      )
      const data = await response.json()
      setSuggestions(data || [])
    } catch (err) {
      console.error('Geocoding error:', err)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => searchLocation(value), 500)
  }

  const selectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)
    setMarker({ lat, lng })
    setMapCenter([lat, lng])
    setSearchQuery(suggestion.display_name)
    setSuggestions([])
    onLocationSelect({ name: suggestion.display_name, lat, lng })
    
    // Fly to location
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 15)
    }
  }

  const handleMapClick = async (lat: number, lng: number) => {
    setMarker({ lat, lng })

    // Reverse geocode to get location name
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setSearchQuery(locationName)
      onLocationSelect({ name: locationName, lat, lng })
    } catch (err) {
      console.error('Reverse geocoding error:', err)
      onLocationSelect({ name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng })
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-amber-50 border-b border-stone-200 last:border-b-0"
              >
                <p className="font-medium text-stone-800">{suggestion.name || suggestion.display_name.split(',')[0]}</p>
                <p className="text-sm text-stone-600">{suggestion.display_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-96 rounded-lg overflow-hidden border border-stone-300 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={customIcon} />
          )}
        </MapContainer>
      </div>
      
      <p className="text-sm text-stone-600 text-center">
        Click anywhere on the map to set the location
      </p>
    </div>
  )
}
