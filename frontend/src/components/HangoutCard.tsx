import { Link } from 'react-router-dom'
import type { Hangout } from '../context/AppContext'

export default function HangoutCard({ hangout }: { hangout: Hangout }) {
  const spotsLeft = hangout.maxParticipants - hangout.participants.length
  const isFull = spotsLeft === 0
  
  return (
    <Link to={`/hangout/${hangout.id}`}>
      <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-700 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-amber-900">{hangout.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isFull ? 'bg-stone-300 text-stone-700' : 'bg-green-600 text-white'
          }`}>
            {isFull ? 'Full' : `${spotsLeft} spots`}
          </span>
        </div>
        <p className="text-stone-700 text-sm mb-3 line-clamp-2">{hangout.description}</p>
        <div className="text-sm text-amber-800 space-y-1">
          <p>📅 {new Date(hangout.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at {hangout.time}</p>
          <p>📍 {hangout.location}</p>
          <p>👥 {hangout.participants.length}/{hangout.maxParticipants} joined</p>
        </div>
      </div>
    </Link>
  )
}
