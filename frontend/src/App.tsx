import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import AreasPage from './pages/AreasPage'
import AreaPage from './pages/AreaPage'
import HangoutDetail from './pages/HangoutDetail'
import CreateHangout from './pages/CreateHangout'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/area/:areaId" element={<AreaPage />} />
          <Route path="/hangout/:hangoutId" element={<HangoutDetail />} />
          <Route path="/create" element={<CreateHangout />} />
        </Routes>
      </main> 
      <Footer />
    </div>
  )
}

export default App
