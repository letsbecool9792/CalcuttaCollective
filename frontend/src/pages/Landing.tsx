import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Quick vibe shortcuts
const QUICK_VIBES = [
  { id: 'social', emoji: '🗣️', label: 'Feeling Social' },
  { id: 'quiet', emoji: '🌿', label: 'Feeling Quiet' },
  { id: 'budget', emoji: '💸', label: 'Low Budget' },
  { id: 'food', emoji: '🍜', label: 'Food Hunt' },
]

// Color mapping for hangouts
const HANGOUT_COLORS = [
  { color: 'from-amber-100 to-orange-50', borderColor: 'border-amber-300', emoji: '☕' },
  { color: 'from-orange-100 to-yellow-50', borderColor: 'border-orange-300', emoji: '🌅' },
  { color: 'from-green-100 to-emerald-50', borderColor: 'border-green-300', emoji: '🍜' },
]

interface Hangout {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
}

export default function Landing() {
  const [hangouts, setHangouts] = useState<Hangout[]>([])

  useEffect(() => {
    fetch(`${API_URL}/api/hangouts`)
      .then(res => res.json())
      .then(data => {
        // Get up to 3 upcoming hangouts
        const upcoming = (data || []).slice(0, 3)
        setHangouts(upcoming)
      })
      .catch(err => console.error('Error fetching hangouts:', err))
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <header className="bg-linear-to-b from-amber-100 via-orange-50 to-stone-50 max-w-full px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl leading-relaxed font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-6 px-2">
          Explore your city. Together.
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed max-w-4xl mx-auto">
          Calcutta Collective helps you discover places and create small, real-world hangouts around them — from cafés and heritage lanes to walks, sunsets, and everything in between.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-10">
          <Link 
            to="/create"
            className="w-full sm:w-auto bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Create Hangout
          </Link>
          <Link 
            to="/explore"
            className="w-full sm:w-auto bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Explore by Vibe
          </Link>
        </div>

        {/* Quick Vibe Shortcuts */}
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {QUICK_VIBES.map(vibe => (
            <Link
              key={vibe.id}
              to="/explore"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all text-sm"
            >
              <span>{vibe.emoji}</span>
              <span className="text-stone-700">{vibe.label}</span>
            </Link>
          ))}
        </div>
      </header>

      {/* Upcoming Hangouts */}
      <section className="bg-stone-50 py-12 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-stone-800">Upcoming Hangouts</h2>
            <Link to="/areas" className="text-amber-700 font-medium hover:underline text-sm">
              View all →
            </Link>
          </div>
          {hangouts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
              <p className="text-stone-500 mb-4">No hangouts yet. Be the first to create one!</p>
              <Link to="/create" className="text-amber-700 font-medium hover:underline">
                Create a hangout →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {hangouts.map((hangout, index) => {
                const style = HANGOUT_COLORS[index % HANGOUT_COLORS.length]
                return (
                  <Link
                    key={hangout.id}
                    to={`/hangout/${hangout.id}`}
                    className={`bg-linear-to-br ${style.color} p-6 rounded-lg border ${style.borderColor} hover:shadow-lg transition-all group`}
                  >
                    <span className="text-3xl mb-3 block">{style.emoji}</span>
                    <h3 className="font-bold text-stone-800 mb-2 group-hover:text-amber-900">{hangout.title}</h3>
                    <p className="text-sm text-stone-600 mb-3 line-clamp-2">{hangout.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 bg-white px-2 py-1 rounded-full">{hangout.location}</span>
                      <span className="text-xs text-stone-500">
                        {new Date(hangout.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-amber-900 font-bold text-lg mb-3">1. Explore areas, not just places</div>
              <p className="text-amber-800">Browse neighborhoods by vibe — cafés, heritage spots, walks, and things to do.</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-900 font-bold text-lg mb-3">2. Create or join a hangout</div>
              <p className="text-green-800">Start a small plan or join one nearby. No big events. Just casual, real outings.</p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-900 font-bold text-lg mb-3">3. Go outside</div>
              <p className="text-orange-800">Meet up, explore the city, and share the experience for others to discover later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">Who this is for</h2>
          <div className="space-y-4">
            <div className="bg-linear-to-r from-green-100 to-emerald-50 p-6 rounded-lg border-l-4 border-green-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-green-900 font-medium text-lg">New to the city and don't know where to start</p>
            </div>
            <div className="bg-linear-to-r from-amber-100 to-orange-50 p-6 rounded-lg border-l-4 border-amber-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-amber-900 font-medium text-lg">Locals stuck in the same weekend routine</p>
            </div>
            <div className="bg-linear-to-r from-orange-100 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-orange-900 font-medium text-lg">Solo travelers who want experiences, not just locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Exists */}
      <section className="bg-green-900 text-green-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Why this exists</h2>
          <p className="text-xl leading-relaxed mb-6">
            We don't need more apps that keep us indoors.
          </p>
          <p className="text-xl leading-relaxed">
            Calcutta Collective is built to reduce the friction of going outside — by turning discovery into action and making it easier to explore cities together instead of alone.
          </p>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">What makes it different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-amber-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-amber-900 font-medium leading-7">Area-based discovery instead of endless listings</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-green-900 font-medium leading-7">Small, intentional hangouts instead of public events</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-orange-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-orange-900 font-medium leading-7">Focus on experiences, not ratings or influencers</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-amber-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-amber-900 font-medium leading-7">Built for mobile, with zero install friction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link 
            to="/create"
            className="w-full sm:w-auto bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-10 py-4 rounded-lg text-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Create Hangout
          </Link>
          <Link 
            to="/areas"
            className="w-full sm:w-auto bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-10 py-4 rounded-lg text-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Explore Areas
          </Link>
        </div>
      </section>
    </div>
  )
}
