import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import JoinRequestModal from '../components/JoinRequestModal'
import ManageRequestsModal from '../components/ManageRequestsModal'
import MapLocationView from '../components/MapLocationView'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Participant {
  id?: string
  userId?: string
  name: string
  joinedAt: number
  status?: 'approved' | 'pending'
}

interface JoinRequest {
  id: string
  hangoutId: string
  userId: string
  userName: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

interface Hangout {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  latitude?: number
  longitude?: number
  maxParticipants: number
  participants: Participant[]
  createdBy: string
  createdById?: string
  createdAt: number
  reflections?: any[]
}

export default function HangoutDetail() {
  const { hangoutId } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  
  const [hangout, setHangout] = useState<Hangout | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [userRequestStatus, setUserRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none')

  // Show reflection success message if redirected after reflecting
  const showReflectedSuccess = location.state?.reflected

  useEffect(() => {
    fetchHangout()
  }, [hangoutId])

  useEffect(() => {
    if (user && hangout) {
      checkUserStatus()
    }
  }, [hangoutId, user, hangout])

  const fetchHangout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hangouts/${hangoutId}`)
      const data = await res.json()
      setHangout(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching hangout:', err)
      setLoading(false)
    }
  }

  const checkUserStatus = async () => {
    if (!user) return
    
    try {
      const res = await fetch(`${API_URL}/api/hangouts/${hangoutId}/requests?userId=${user.id}`)
      const data = await res.json()
      
      if (data.userRequest) {
        setUserRequestStatus(data.userRequest.status)
      } else if (data.isParticipant) {
        setUserRequestStatus('approved')
      }
      
      // If host, get all requests
      if (data.isHost) {
        setJoinRequests(data.requests || [])
      }
    } catch (err) {
      console.error('Error checking status:', err)
    }
  }

  const handleJoinRequest = async (message: string) => {
    if (!user) return

    try {
      const res = await fetch(`${API_URL}/api/hangouts/${hangoutId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          message
        })
      })
      
      if (res.ok) {
        setUserRequestStatus('pending')
        setShowJoinModal(false)
      }
    } catch (err) {
      console.error('Error sending request:', err)
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${requestId}/approve`, {
        method: 'POST'
      })
      if (res.ok) {
        fetchHangout()
        checkUserStatus()
      }
    } catch (err) {
      console.error('Error approving request:', err)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${requestId}/reject`, {
        method: 'POST'
      })
      if (res.ok) {
        checkUserStatus()
      }
    } catch (err) {
      console.error('Error rejecting request:', err)
    }
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
  const isHost = user?.id === hangout.createdById || user?.name === hangout.createdBy
  const isApproved = userRequestStatus === 'approved'
  const isPending = userRequestStatus === 'pending'
  const hangoutDate = new Date(hangout.date + 'T' + hangout.time)
  const isPast = hangoutDate < new Date()
  const pendingCount = joinRequests.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-stone-50 relative z-0">
      <div className="max-w-3xl mx-auto px-4 py-8 relative z-0">
        
        {/* Reflection Success Banner */}
        {showReflectedSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>✨</span>
            <span>Thanks for sharing your reflection!</span>
          </div>
        )}

        {/* Post-Hangout Reflection CTA */}
        {isPast && isApproved && (
          <div className="bg-linear-to-r from-green-100 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
            <h3 className="text-lg font-bold text-green-900 mb-2">How was it? ✨</h3>
            <p className="text-green-800 mb-4">Share your experience and help others discover great hangouts</p>
            <Link
              to={`/hangout/${hangoutId}/reflect`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Add Your Reflection
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="bg-linear-to-br from-amber-100 to-orange-50 rounded-lg p-6 md:p-8 border-l-4 border-amber-800 shadow-lg mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 flex-1">{hangout.title}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
              isPast ? 'bg-stone-300 text-stone-700' : isFull ? 'bg-stone-300 text-stone-700' : 'bg-green-600 text-white'
            }`}>
              {isPast ? 'Completed' : isFull ? 'Full' : `${spotsLeft} spots left`}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Host View */}
            {isHost && (
              <>
                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-lg font-bold hover:from-amber-800 hover:to-orange-800 transition-all relative"
                >
                  Manage Requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <Link
                  to={`/hangout/${hangoutId}/chat`}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-center"
                >
                  Open Group Chat
                </Link>
              </>
            )}

            {/* Approved Participant View */}
            {!isHost && isApproved && (
              <Link
                to={`/hangout/${hangoutId}/chat`}
                className="flex-1 px-6 py-3 bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-lg font-bold hover:from-amber-800 hover:to-orange-800 transition-all text-center"
              >
                Open Group Chat
              </Link>
            )}

            {/* Pending View */}
            {!isHost && isPending && (
              <div className="flex-1 px-6 py-3 bg-amber-100 text-amber-800 rounded-lg font-bold text-center">
                ⏳ Request Pending
              </div>
            )}

            {/* Not Joined View */}
            {!isHost && !isApproved && !isPending && !isPast && (
              <>
                {user ? (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    disabled={isFull}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                      isFull 
                        ? 'bg-stone-300 text-stone-600 cursor-not-allowed' 
                        : 'bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isFull ? 'Hangout Full' : 'Request to Join'}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: location }}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-lg font-bold text-center hover:from-amber-800 hover:to-orange-800 transition-all"
                  >
                    Sign in to Join
                  </Link>
                )}
              </>
            )}

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
        <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200 mb-6">
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

        {/* Reflections */}
        {hangout.reflections && hangout.reflections.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200 mb-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Reflections</h2>
            <div className="space-y-4">
              {hangout.reflections.map((reflection, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(num => (
                        <span key={num} className={num <= reflection.rating ? 'text-amber-500' : 'text-stone-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-stone-500">by {reflection.userName}</span>
                  </div>
                  {reflection.reflection && (
                    <p className="text-stone-700 italic">"{reflection.reflection}"</p>
                  )}
                  {reflection.placesVisited?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {reflection.placesVisited.map((place: string, pIdx: number) => (
                        <span key={pIdx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {place}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created By */}
        <div className="mt-6 text-center text-sm text-stone-500">
          Created by {hangout.createdBy} on {new Date(hangout.createdAt).toLocaleDateString('en-IN')}
        </div>
      </div>

      {/* Modals */}
      {showJoinModal && (
        <JoinRequestModal
          hangoutTitle={hangout.title}
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinRequest}
        />
      )}

      {showManageModal && (
        <ManageRequestsModal
          hangoutTitle={hangout.title}
          requests={joinRequests}
          onClose={() => setShowManageModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
