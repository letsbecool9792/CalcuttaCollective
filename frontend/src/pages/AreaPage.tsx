import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import HangoutCard from '../components/HangoutCard'
import MapHangoutsView from '../components/MapHangoutsView'
import type { Area } from '../context/AppContext'

export default function AreaPage() {
  const { areaId } = useParams()
  const [area, setArea] = useState<Area | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/areas/${areaId}`)
      .then(res => res.json())
      .then(data => {
        setArea(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching area:', err)
        setLoading(false)
      })
  }, [areaId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Area not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section 
        className="h-64 md:h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${area.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-6xl mx-auto px-4 pb-8 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{area.name}</h1>
            <div className="flex flex-wrap gap-2">
              {area.vibe.map((v, i) => (
                <span 
                  key={i} 
                  className="bg-white bg-opacity-90 text-amber-900 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-lg text-stone-700">{area.description}</p>
      </section>

      {/* Hangouts */}
      <section className="bg-green-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-stone-800">Upcoming Hangouts</h2>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-white border border-stone-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Map
                </button>
              </div>

              <Link 
                to="/create" 
                state={{ areaId: area.id }}
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Create Hangout
              </Link>
            </div>
          </div>
          
          {area.hangouts && area.hangouts.length > 0 ? (
            <>
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {area.hangouts.map(hangout => (
                    <HangoutCard key={hangout.id} hangout={hangout} />
                  ))}
                </div>
              ) : (
                <MapHangoutsView hangouts={area.hangouts} />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
              <p className="text-stone-600 mb-4">No hangouts yet in this area.</p>
              <Link 
                to="/create" 
                state={{ areaId: area.id }}
                className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Be the first to create one
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Places */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Places to Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {area.places && area.places.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>
    </div>
  )
}
