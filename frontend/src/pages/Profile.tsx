import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface PastHangout {
  id: string
  title: string
  date: string
  location: string
  reflected: boolean
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [pastHangouts, setPastHangouts] = useState<PastHangout[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setBio(user.bio || '')
      fetchPastHangouts()
    }
  }, [user])

  const fetchPastHangouts = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/hangouts`)
      if (!res.ok) {
        console.error('Failed to fetch hangouts:', res.status)
        return
      }
      const data = await res.json()
      // Ensure we always get an array
      setPastHangouts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching past hangouts:', err)
      setPastHangouts([])
    }
  }

  const handleSave = async () => {
    setLoading(true)
    await updateProfile({ name, bio })
    setEditing(false)
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-stone-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-4xl font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell others a bit about yourself..."
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-stone-800">{user.name}</h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-amber-700 hover:underline"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <p className="text-stone-600 mb-3">{user.bio || 'No bio yet'}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <span>📧</span> {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🎉</span> {user.pastHangoutsCount} hangouts
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Past Hangouts */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-200 mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Your Hangouts</h2>
          
          {pastHangouts.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <p className="mb-3">You haven't joined any hangouts yet</p>
              <Link
                to="/areas"
                className="text-amber-700 font-medium hover:underline"
              >
                Start exploring →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pastHangouts.map(hangout => {
                const isPast = new Date(hangout.date) < new Date()
                return (
                  <div key={hangout.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-stone-800">{hangout.title}</h3>
                      <p className="text-sm text-stone-500">
                        {hangout.date ? new Date(hangout.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No date'} • {hangout.location || 'No location'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPast && !hangout.reflected && (
                        <Link
                          to={`/hangout/${hangout.id}/reflect`}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Reflect
                        </Link>
                      )}
                      {hangout.reflected && (
                        <span className="text-sm text-green-600">✓ Reflected</span>
                      )}
                      <Link
                        to={`/hangout/${hangout.id}`}
                        className="text-amber-700 text-sm hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
