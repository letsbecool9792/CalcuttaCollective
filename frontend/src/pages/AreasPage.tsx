import { useEffect, useState } from 'react'
import AreaCard from '../components/AreaCard'
import type { Area } from '../context/AppContext'

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/areas`)
      .then(res => res.json())
      .then(data => {
        setAreas(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching areas:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-stone-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-4 px-2">
          Explore Kolkata
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-8">
          Discover neighborhoods, join small hangouts, and experience the city with people who actually want to go there.
        </p>
      </section>

      {/* Areas */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </section>
    </div>
  )
}
