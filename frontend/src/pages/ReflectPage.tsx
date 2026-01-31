import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Place {
  id: string
  name: string
}

export default function ReflectPage() {
  const { hangoutId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [hangout, setHangout] = useState<any>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [rating, setRating] = useState(0)
  const [reflection, setReflection] = useState('')
  const [placesVisited, setPlacesVisited] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    // Fetch hangout and places in parallel
    Promise.all([
      fetch(`${API_URL}/api/hangouts/${hangoutId}`).then(r => r.json()),
      fetch(`${API_URL}/api/places`).then(r => r.json())
    ])
      .then(([hangoutData, placesData]) => {
        setHangout(hangoutData)
        setPlaces(Array.isArray(placesData) ? placesData : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [hangoutId])

  const togglePlace = (place: string) => {
    setPlacesVisited(prev =>
      prev.includes(place)
        ? prev.filter(p => p !== place)
        : [...prev, place]
    )
  }

  const handleSubmit = async () => {
    if (!user || rating === 0) return

    setSubmitting(true)
    try {
      await fetch(`${API_URL}/api/hangouts/${hangoutId}/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          rating,
          reflection,
          placesVisited,
          photoUrl: photoUrl || undefined
        })
      })
      navigate(`/hangout/${hangoutId}`, { state: { reflected: true } })
    } catch (err) {
      console.error('Error submitting reflection:', err)
      alert('Failed to submit reflection')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  if (!hangout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Hangout not found</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-stone-600">Please log in to add a reflection</p>
        <Link to="/login" className="text-amber-700 font-medium hover:underline">
          Sign in →
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-stone-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">✨</span>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">How was it?</h1>
          <p className="text-stone-600">
            Reflect on <span className="font-medium text-green-800">"{hangout.title}"</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200 space-y-8">
          {/* Rating */}
          <div>
            <label className="block text-lg font-medium text-stone-800 mb-3">
              Rate your experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`w-12 h-12 rounded-full text-2xl transition-all ${
                    rating >= num
                      ? 'bg-amber-500 text-white scale-110'
                      : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {rating >= num ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Written Reflection */}
          <div>
            <label className="block text-lg font-medium text-stone-800 mb-3">
              Share your thoughts (optional)
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What made this hangout memorable? What did you discover?"
              rows={4}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Places Visited */}
          <div>
            <label className="block text-lg font-medium text-stone-800 mb-3">
              Places you visited
            </label>
            <div className="flex flex-wrap gap-2">
              {places.map(place => (
                <button
                  key={place.id}
                  onClick={() => togglePlace(place.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    placesVisited.includes(place.name)
                      ? 'bg-green-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {place.name}
                </button>
              ))}
              {/* Always include "Other" option */}
              <button
                onClick={() => togglePlace('Other')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  placesVisited.includes('Other')
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Other
              </button>
            </div>
          </div>

          {/* Photo Upload (simplified - just URL) */}
          <div>
            <label className="block text-lg font-medium text-stone-800 mb-3">
              Add a photo (optional)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste an image URL..."
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {photoUrl && (
              <div className="mt-3">
                <img 
                  src={photoUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Reflection'}
          </button>

          <p className="text-center text-sm text-stone-500">
            Your reflection helps others discover great experiences
          </p>
        </div>
      </div>
    </div>
  )
}
