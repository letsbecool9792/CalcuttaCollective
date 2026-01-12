import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <header className="bg-linear-to-b from-amber-100 via-orange-50 to-stone-50 max-w-full px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl leading-relaxed font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-6 px-2">
          Explore your city. Together.
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed max-w-4xl mx-auto">
          Calcutta Collective helps you discover places and create small, real-world hangouts around them — from cafés and heritage lanes to walks, sunsets, and everything in between.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link 
            to="/create"
            className="w-full sm:w-auto bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Create Hangout
          </Link>
          <Link 
            to="/areas"
            className="w-full sm:w-auto bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Explore Areas
          </Link>
        </div>
      </header>

      {/* How It Works */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-amber-900 font-bold text-lg mb-3">1. Explore areas, not just places</div>
              <p className="text-amber-800">Browse neighborhoods by vibe — cafés, heritage spots, walks, and things to do.</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-900 font-bold text-lg mb-3">2. Create or join a hangout</div>
              <p className="text-green-800">Start a small plan or join one nearby. No big events. Just casual, real outings.</p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-900 font-bold text-lg mb-3">3. Go outside</div>
              <p className="text-orange-800">Meet up, explore the city, and share the experience for others to discover later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">Who this is for</h2>
          <div className="space-y-4">
            <div className="bg-linear-to-r from-green-100 to-emerald-50 p-6 rounded-lg border-l-4 border-green-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-green-900 font-medium text-lg">New to the city and don't know where to start</p>
            </div>
            <div className="bg-linear-to-r from-amber-100 to-orange-50 p-6 rounded-lg border-l-4 border-amber-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-amber-900 font-medium text-lg">Locals stuck in the same weekend routine</p>
            </div>
            <div className="bg-linear-to-r from-orange-100 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-700 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-orange-900 font-medium text-lg">Solo travelers who want experiences, not just locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Exists */}
      <section className="bg-green-900 text-green-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Why this exists</h2>
          <p className="text-xl leading-relaxed mb-6">
            We don't need more apps that keep us indoors.
          </p>
          <p className="text-xl leading-relaxed">
            Calcutta Collective is built to reduce the friction of going outside — by turning discovery into action and making it easier to explore cities together instead of alone.
          </p>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-amber-900 to-green-900 bg-clip-text text-transparent mb-12 text-center">What makes it different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-amber-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-amber-900 font-medium leading-7">Area-based discovery instead of endless listings</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-green-900 font-medium leading-7">Small, intentional hangouts instead of public events</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-orange-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-orange-900 font-medium leading-7">Focus on experiences, not ratings or influencers</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-amber-700 text-2xl leading-7 shrink-0">•</span>
              <p className="text-amber-900 font-medium leading-7">Built for mobile, with zero install friction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link 
            to="/create"
            className="w-full sm:w-auto bg-linear-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-10 py-4 rounded-lg text-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Create Hangout
          </Link>
          <Link 
            to="/areas"
            className="w-full sm:w-auto bg-linear-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-10 py-4 rounded-lg text-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Explore Areas
          </Link>
        </div>
      </section>
    </div>
  )
}
