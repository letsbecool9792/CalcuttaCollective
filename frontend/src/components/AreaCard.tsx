import { Link } from 'react-router-dom'
import type { Area } from '../context/AppContext'

export default function AreaCard({ area }: { area: Area }) {
  return (
    <Link to={`/area/${area.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-stone-200">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${area.image})` }}
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-stone-800 mb-2">{area.name}</h3>
          <p className="text-stone-600 text-sm mb-3 line-clamp-2">{area.description}</p>
          <div className="flex flex-wrap gap-2">
            {area.vibe.map((v, i) => (
              <span 
                key={i} 
                className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
