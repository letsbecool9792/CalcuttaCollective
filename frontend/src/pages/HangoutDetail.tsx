import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import JoinModal from '../components/JoinModal'
import MapLocationView from '../components/MapLocationView'
import type { Hangout } from '../context/AppContext'

export default function HangoutDetail() {
  const { hangoutId } = useParams()
  const [hangout, setHangout] = useState<Hangout | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/hangouts/${hangoutId}`)
      .then(res => res.json())
      .then(data => {
        setHangout(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching hangout:', err)
        setLoading(false)
      })
  }, [hangoutId])

  const handleJoin = (name: string) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/hangouts/${hangoutId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setHangout(data)
          setShowJoinModal(false)
          alert('Successfully joined the hangout!')
        }
      })
      .catch(err => {
        console.error('Error joining hangout:', err)
        alert('Failed to join. Please try again.')
      })
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => {
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      })
      .catch(() => alert('Failed to copy link'))
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

  const spotsLeft = hangout.maxParticipants - hangout.participants.length
  const isFull = spotsLeft === 0

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-stone-50 relative z-0">
      <div className="max-w-3xl mx-auto px-4 py-8 relative z-0">
        {/* Header */}
        <div className="bg-linear-to-br from-amber-100 to-orange-50 rounded-lg p-6 md:p-8 border-l-4 border-amber-800 shadow-lg mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 flex-1">{hangout.title}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
              isFull ? 'bg-stone-300 text-stone-700' : 'bg-green-600 text-white'
            }`}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </span>
          </div>

          <div className="space-y-3 text-amber-900 mb-6">
            <p className="flex items-center gap-2 text-lg">
              <span>📅</span>
              <span>{new Date(hangout.date).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {hangout.time}</span>
            </p>
            <p className="flex items-center gap-2 text-lg">
              <span>📍</span>
              <span>{hangout.location}</span>
            </p>
            <p className="flex items-center gap-2 text-lg">
              <span>👥</span>
              <span>{hangout.participants.length}/{hangout.maxParticipants} people joined</span>
            </p>
          </div>

          <p className="text-stone-700 text-lg leading-relaxed mb-6">
            {hangout.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              disabled={isFull}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                isFull 
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed' 
                  : 'bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isFull ? 'Hangout Full' : 'Join This Hangout'}
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 border-2 border-amber-700 text-amber-900 rounded-lg font-bold hover:bg-amber-50 transition-colors"
            >
              {shareSuccess ? '✓ Copied!' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* Map */}
        {hangout.latitude && hangout.longitude && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200 mb-6">
            <MapLocationView
              latitude={hangout.latitude}
              longitude={hangout.longitude}
              locationName={hangout.location}
            />
          </div>
        )}

        {/* Participants */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Who's Coming</h2>
          <div className="space-y-3">
            {hangout.participants.map((participant, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{participant.name}</p>
                  {idx === 0 && (
                    <p className="text-xs text-green-700">Organizer</p>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {new Date(participant.joinedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Created By */}
        <div className="mt-6 text-center text-sm text-stone-500">
          Created by {hangout.createdBy} on {new Date(hangout.createdAt).toLocaleDateString('en-IN')}
        </div>
      </div>

      {showJoinModal && (
        <JoinModal
          hangoutTitle={hangout.title}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoin}
        />
      )}
    </div>
  )
}
