import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import AreasPage from './pages/AreasPage'
import AreaPage from './pages/AreaPage'
import HangoutDetail from './pages/HangoutDetail'
import CreateHangout from './pages/CreateHangout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ExplorePage from './pages/ExplorePage'
import ReflectPage from './pages/ReflectPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/area/:areaId" element={<AreaPage />} />
            <Route path="/hangout/:hangoutId" element={<HangoutDetail />} />
            <Route path="/hangout/:hangoutId/chat" element={<ChatPage />} />
            <Route path="/hangout/:hangoutId/reflect" element={<ReflectPage />} />
            <Route path="/create" element={<CreateHangout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main> 
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
