import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { parseResume } from '../schema/resume'

export default function Header() {
  const navigate = useNavigate()
  const { resume, setResume } = useResume()
  const base = 'px-3 py-2 rounded-md text-sm font-medium'
  const active = 'bg-brand-600 text-white'
  const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'

  function handleExport() {
    try {
      const data = JSON.stringify(resume, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (_) {}
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const json = JSON.parse(text)
        setResume(parseResume(json))
        navigate('/builder')
      } catch (_) {
        alert('Invalid JSON file')
      }
    }
    input.click()
  }

  function handlePrint() {
    navigate('/preview?print=1')
  }

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
          <div className="ml-3 flex items-center gap-2">
            <button onClick={handleImport} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              Import
            </button>
            <button onClick={handleExport} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              Export
            </button>
            <button onClick={handlePrint} className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700">
              Print
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
