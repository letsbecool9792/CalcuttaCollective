import { createContext, useContext, useState, type ReactNode } from 'react'

interface Area {
  id: string
  name: string
  description: string
  vibe: string[]
  image: string
  places?: Place[]
  hangouts?: Hangout[]
}

interface Place {
  id: string
  areaId: string
  name: string
  type: string
  description: string
}

interface Participant {
  name: string
  joinedAt: number
}

interface Hangout {
  id: string
  areaId: string
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
  createdAt: number
}

interface AppContextType {
  areas: Area[]
  hangouts: Hangout[]
  setAreas: (areas: Area[]) => void
  setHangouts: (hangouts: Hangout[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [areas, setAreas] = useState<Area[]>([])
  const [hangouts, setHangouts] = useState<Hangout[]>([])

  return (
    <AppContext.Provider value={{ areas, hangouts, setAreas, setHangouts }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export type { Area, Place, Hangout, Participant }
