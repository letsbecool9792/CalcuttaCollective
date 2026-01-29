import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-linear-to-r from-amber-900 to-green-900 text-stone-100 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold hover:text-stone-200 transition-colors">
            Calcutta Collective
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/explore" className="hover:text-amber-300 transition-colors">
              Explore
            </Link>
            <Link to="/areas" className="hover:text-amber-300 transition-colors">
              Areas
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/create" 
            className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Hangout
          </Link>
          
          {user ? (
            <Link 
              to="/profile"
              className="flex items-center gap-2 hover:text-amber-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="text-sm hover:text-amber-300 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
