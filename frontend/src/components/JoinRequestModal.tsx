import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface JoinRequestModalProps {
  hangoutTitle: string
  onClose: () => void
  onSubmit: (message: string) => Promise<void>
}

export default function JoinRequestModal({ hangoutTitle, onClose, onSubmit }: JoinRequestModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(message)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Request to Join</h2>
        <p className="text-stone-600 mb-6">
          Send a request to join <span className="font-semibold text-amber-900">"{hangoutTitle}"</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Joining as:</span> {user?.name}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Introduce yourself (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm excited about this hangout because..."
              rows={3}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-stone-500 mt-1">
              This helps the host know who's joining
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-lg hover:from-amber-800 hover:to-orange-800 transition-all font-medium disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>

        <p className="text-xs text-stone-500 text-center mt-4">
          The host will review your request and you'll be notified when approved
        </p>
      </div>
    </div>
  )
}
