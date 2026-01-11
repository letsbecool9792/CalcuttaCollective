export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-amber-900 to-green-900 text-stone-200 py-8">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        <p className="font-semibold">Calcutta Collective</p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-stone-100 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
