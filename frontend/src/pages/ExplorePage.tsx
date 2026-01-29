import { useState } from 'react'
import { Link } from 'react-router-dom'

// Hard-coded vibe data - maps vibes to areas, places, and hangout ideas
const VIBES = [
  {
    id: 'social',
    name: 'Feeling Social',
    emoji: '🗣️',
    description: 'Meet new people and have great conversations',
    color: 'from-amber-500 to-orange-500',
    areas: ['park-street', 'college-street'],
    suggestedPlaces: [
      { name: 'Indian Coffee House', area: 'College Street', why: 'Classic conversation spot' },
      { name: 'Flurys', area: 'Park Street', why: 'Lively atmosphere for meetups' },
    ],
    hangoutIdeas: [
      'Coffee and conversation walk',
      'Sunday brunch meetup',
      'Book club discussion at Coffee House',
    ]
  },
  {
    id: 'quiet',
    name: 'Feeling Quiet',
    emoji: '🌿',
    description: 'Peaceful spots for reflection and calm',
    color: 'from-green-500 to-emerald-500',
    areas: ['prinsep-ghat', 'college-street'],
    suggestedPlaces: [
      { name: 'Prinsep Ghat', area: 'Prinsep Ghat', why: 'Peaceful riverfront walks' },
      { name: 'College Square', area: 'College Street', why: 'Quiet park for reading' },
      { name: 'Millennium Park', area: 'Prinsep Ghat', why: 'Serene green space' },
    ],
    hangoutIdeas: [
      'Sunrise walk by the river',
      'Silent reading session at the park',
      'Evening photography stroll',
    ]
  },
  {
    id: 'budget',
    name: 'Low Budget',
    emoji: '💸',
    description: 'Great experiences without spending much',
    color: 'from-blue-500 to-indigo-500',
    areas: ['college-street', 'new-market', 'prinsep-ghat'],
    suggestedPlaces: [
      { name: 'College Street Bookstalls', area: 'College Street', why: '₹10 chai, free browsing' },
      { name: 'Street Food at New Market', area: 'New Market', why: 'Chaat and rolls under ₹50' },
      { name: 'Prinsep Ghat Sunset', area: 'Prinsep Ghat', why: 'Free views, ₹5 chai' },
    ],
    hangoutIdeas: [
      'Street food crawl under ₹200',
      'Free heritage walk + chai',
      'Sunset watching with phuchka',
    ]
  },
  {
    id: 'adventure',
    name: 'Feeling Adventurous',
    emoji: '🗺️',
    description: 'Discover hidden gems and new experiences',
    color: 'from-purple-500 to-pink-500',
    areas: ['new-market', 'college-street'],
    suggestedPlaces: [
      { name: 'Hidden lanes of New Market', area: 'New Market', why: 'Get lost in the maze' },
      { name: 'Presidency backstreets', area: 'College Street', why: 'Student hangouts off the map' },
    ],
    hangoutIdeas: [
      'Mystery lane exploration',
      'Find the best hidden chai stall',
      'Photo walk through forgotten alleys',
    ]
  },
  {
    id: 'food',
    name: 'Food Hunt',
    emoji: '🍜',
    description: 'Explore the best local eats',
    color: 'from-red-500 to-orange-500',
    areas: ['park-street', 'new-market', 'college-street'],
    suggestedPlaces: [
      { name: 'Mocambo', area: 'Park Street', why: 'Classic Continental' },
      { name: 'Nizam\'s Kathi Roll', area: 'New Market', why: 'The original kathi roll' },
      { name: 'Coffee House omelette', area: 'College Street', why: 'Legendary breakfast' },
    ],
    hangoutIdeas: [
      'Park Street food trail',
      'Best kathi roll hunt',
      'Breakfast crawl across areas',
    ]
  }
]

export default function ExplorePage() {
  const [selectedVibe, setSelectedVibe] = useState<typeof VIBES[0] | null>(null)

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">How are you feeling?</h1>
          <p className="text-stone-600 text-lg">Pick a vibe and we'll suggest places and hangout ideas</p>
        </div>

        {/* Vibe Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {VIBES.map(vibe => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(selectedVibe?.id === vibe.id ? null : vibe)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedVibe?.id === vibe.id
                  ? 'border-amber-500 bg-white shadow-lg scale-105'
                  : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <span className="text-4xl mb-3 block">{vibe.emoji}</span>
              <h3 className="font-bold text-stone-800 mb-1">{vibe.name}</h3>
              <p className="text-sm text-stone-500">{vibe.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Vibe Details */}
        {selectedVibe && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Suggested Areas */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200">
              <h2 className="text-xl font-bold text-stone-800 mb-4">Suggested Areas</h2>
              <div className="flex flex-wrap gap-2">
                {selectedVibe.areas.map(areaId => (
                  <Link
                    key={areaId}
                    to={`/area/${areaId}`}
                    className={`px-4 py-2 rounded-full bg-linear-to-r ${selectedVibe.color} text-white font-medium hover:opacity-90 transition-opacity`}
                  >
                    {areaId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Link>
                ))}
              </div>
            </div>

            {/* Suggested Places */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200">
              <h2 className="text-xl font-bold text-stone-800 mb-4">Places We Recommend</h2>
              <div className="space-y-3">
                {selectedVibe.suggestedPlaces.map((place, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-stone-800">{place.name}</h3>
                      <p className="text-sm text-stone-500">{place.area}</p>
                    </div>
                    <span className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                      {place.why}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hangout Ideas */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200">
              <h2 className="text-xl font-bold text-stone-800 mb-4">Hangout Ideas</h2>
              <div className="space-y-3">
                {selectedVibe.hangoutIdeas.map((idea, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                    <span className="font-medium text-green-900">{idea}</span>
                    <Link
                      to="/create"
                      state={{ suggestion: idea }}
                      className="text-sm text-green-700 hover:underline font-medium"
                    >
                      Create this →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Link
                to="/create"
                className="inline-block bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg"
              >
                Create a Hangout
              </Link>
            </div>
          </div>
        )}

        {/* Browse by Area fallback */}
        {!selectedVibe && (
          <div className="text-center py-8">
            <p className="text-stone-500 mb-4">Or browse by neighborhood</p>
            <Link
              to="/areas"
              className="text-amber-700 font-medium hover:underline text-lg"
            >
              View All Areas →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
