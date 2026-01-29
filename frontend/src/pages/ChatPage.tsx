import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
}

export default function ChatPage() {
  const { hangoutId } = useParams()
  const { user } = useAuth()
  const [hangout, setHangout] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchHangout()
    fetchMessages()
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [hangoutId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchHangout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hangouts/${hangoutId}`)
      const data = await res.json()
      setHangout(data)
    } catch (err) {
      console.error('Error fetching hangout:', err)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hangouts/${hangoutId}/messages`)
      const data = await res.json()
      setMessages(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || sending) return

    setSending(true)
    try {
      await fetch(`${API_URL}/api/hangouts/${hangoutId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          senderName: user.name,
          text: newMessage.trim()
        })
      })
      setNewMessage('')
      fetchMessages()
    } catch (err) {
      console.error('Error sending message:', err)
    }
    setSending(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-stone-600">Please log in to access chat</p>
        <Link to="/login" className="text-amber-700 font-medium hover:underline">
          Sign in →
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <Link 
              to={`/hangout/${hangoutId}`}
              className="text-sm text-amber-700 hover:underline"
            >
              ← Back to hangout
            </Link>
            <h1 className="font-bold text-stone-800">{hangout?.title || 'Group Chat'}</h1>
          </div>
          <span className="text-sm text-stone-500">
            {hangout?.participants?.length || 0} members
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p className="text-4xl mb-3">💬</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId === user.id
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                    {!isMe && (
                      <p className="text-xs text-stone-500 mb-1 ml-3">{msg.senderName}</p>
                    )}
                    <div className={`px-4 py-2 rounded-2xl ${
                      isMe 
                        ? 'bg-amber-600 text-white rounded-br-md' 
                        : 'bg-white text-stone-800 rounded-bl-md shadow-sm'
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                    <p className={`text-xs text-stone-400 mt-1 ${isMe ? 'text-right mr-3' : 'ml-3'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-stone-200 px-4 py-3">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
