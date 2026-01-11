import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-linear-to-r from-amber-900 to-green-900 text-stone-100 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:text-stone-200 transition-colors">
          Calcutta Collective
        </Link>
        <Link 
          to="/create" 
          className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Create Hangout
        </Link>
      </div>
    </header>
  )
}
