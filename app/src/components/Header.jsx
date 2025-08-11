import { NavLink, Link } from 'react-router-dom'

export default function Header() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium'
  const active = 'bg-brand-600 text-white'
  const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-gray-900">
          ATS Resume
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/builder"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Builder
          </NavLink>
          <NavLink
            to="/preview"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Preview
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
