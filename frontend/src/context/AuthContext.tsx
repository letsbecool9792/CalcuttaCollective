import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  bio: string
  photoUrl?: string
  pastHangoutsCount: number
  createdAt: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cc_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }
      
      setUser(data.user)
      localStorage.setItem('cc_user', JSON.stringify(data.user))
      return { success: true }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const data = await res.json()
      
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' }
      }
      
      setUser(data.user)
      localStorage.setItem('cc_user', JSON.stringify(data.user))
      return { success: true }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cc_user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return
    
    const res = await fetch(`${API_URL}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    
    if (res.ok) {
      setUser(data.user)
      localStorage.setItem('cc_user', JSON.stringify(data.user))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
