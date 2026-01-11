import { useState } from 'react'

interface JoinModalProps {
  hangoutTitle: string
  onClose: () => void
  onJoin: (name: string) => void
}

export default function JoinModal({ hangoutTitle, onClose, onJoin }: JoinModalProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onJoin(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Join Hangout</h2>
        <p className="text-stone-600 mb-6">
          You're joining <span className="font-semibold text-amber-900">"{hangoutTitle}"</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
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
              className="flex-1 px-4 py-2 bg-linear-to-r from-amber-700 to-orange-700 text-white rounded-lg hover:from-amber-800 hover:to-orange-800 transition-all font-medium"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
