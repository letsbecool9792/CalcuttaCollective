import type { Place } from '../context/AppContext'

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-stone-800">{place.name}</h4>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          {place.type}
        </span>
      </div>
      <p className="text-stone-600 text-sm">{place.description}</p>
    </div>
  )
}
