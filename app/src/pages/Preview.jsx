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

        {resume.experience.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-wide text-gray-700">EXPERIENCE</h2>
            <div className="mt-2 space-y-3">
              {resume.experience.map((it) => (
                <div key={it.id} className="text-sm">
                  <div className="font-medium text-gray-900">
                    {it.role}{it.company ? `, ${it.company}` : ''}
                  </div>
                  <div className="text-gray-600">
                    {[it.startDate, (it.current ? 'Present' : it.endDate)].filter(Boolean).join(' — ')}{it.location ? ` • ${it.location}` : ''}
                  </div>
                  {it.bullets?.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {it.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-wide text-gray-700">EDUCATION</h2>
            <div className="mt-2 space-y-3">
              {resume.education.map((it) => (
                <div key={it.id} className="text-sm">
                  <div className="font-medium text-gray-900">{it.degree}{it.school ? `, ${it.school}` : ''}</div>
                  <div className="text-gray-600">{[it.startDate, it.endDate].filter(Boolean).join(' — ')}</div>
                  {it.details && (
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {it.details.split('\n').map((b, i) => b.trim() && <li key={i}>{b.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
