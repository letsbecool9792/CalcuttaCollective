import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Area {
  id: string
  name: string
}

export default function CreateHangout() {
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedAreaId = location.state?.areaId

  const [areas, setAreas] = useState<Area[]>([])
  const [formData, setFormData] = useState({
    areaId: preselectedAreaId || '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '6',
    createdBy: ''
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/areas')
      .then(res => res.json())
      .then(data => setAreas(data))
      .catch(err => console.error('Error fetching areas:', err))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    fetch('http://localhost:3001/api/hangouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        navigate(`/hangout/${data.id}`)
      })
      .catch(err => {
        console.error('Error creating hangout:', err)
        alert('Failed to create hangout. Please try again.')
      })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-stone-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Create a Hangout</h1>
        <p className="text-stone-600 mb-8">
          Start a small gathering and share it with people who want to explore together.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Your Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Area *
            </label>
            <select
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Select an area</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Hangout Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Coffee Walk"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What's the plan? What will you do together?"
              rows={4}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Meeting Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Indian Coffee House entrance"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Max Participants *
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="2"
              max="20"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Create Hangout
          </button>
        </form>
      </div>
    </div>
  )
}
