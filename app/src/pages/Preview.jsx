import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'

export default function Preview() {
  const { resume } = useResume()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('print') === '1') {
      // Slight delay to ensure render is flushed before printing
      const t = setTimeout(() => window.print(), 200)
      return () => clearTimeout(t)
    }
  }, [location.search])

  return (
    <main className="px-4 py-6 flex justify-center">
      <div className="bg-white w-[850px] max-w-full shadow-sm ring-1 ring-gray-200 p-6 print:shadow-none print:ring-0">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">{resume.profile.name}</h1>
          <div className="text-gray-700">{resume.profile.title}</div>
          <div className="mt-1 text-sm text-gray-600">
            {resume.profile.email}
            {resume.profile.phone ? ' · ' + resume.profile.phone : ''}
            {resume.profile.location ? ' · ' + resume.profile.location : ''}
          </div>
        </header>

        {resume.summary && (
          <section className="mt-4">
            <h2 className="text-sm font-semibold tracking-wide text-gray-700">SUMMARY</h2>
            <p className="mt-1 text-gray-800 text-sm leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Sections for experience, education, etc. will be added next */}
      </div>
    </main>
  )
}
