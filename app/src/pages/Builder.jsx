import { useResume } from '../context/ResumeContext'

export default function Builder() {
  const { resume, setResume } = useResume()

  function update(field, value) {
    setResume({ ...resume, [field]: value })
  }

  // Experience helpers
  function addExperience() {
    const item = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [],
    }
    update('experience', [...resume.experience, item])
  }

  function updateExperienceAt(idx, patch) {
    const next = resume.experience.map((it, i) => i === idx ? { ...it, ...patch } : it)
    update('experience', next)
  }

  function removeExperienceAt(idx) {
    const next = resume.experience.filter((_, i) => i !== idx)
    update('experience', next)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Name"
            value={resume.profile.name}
            onChange={(e) => update('profile', { ...resume.profile, name: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Title"
            value={resume.profile.title}
            onChange={(e) => update('profile', { ...resume.profile, title: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Email"
            value={resume.profile.email}
            onChange={(e) => update('profile', { ...resume.profile, email: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Phone"
            value={resume.profile.phone}
            onChange={(e) => update('profile', { ...resume.profile, phone: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2 sm:col-span-2"
            placeholder="Location"
            value={resume.profile.location}
            onChange={(e) => update('profile', { ...resume.profile, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Summary</label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={5}
            placeholder="A concise professional summary"
            value={resume.summary}
            onChange={(e) => update('summary', e.target.value)}
          />
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="rounded-md bg-brand-600 text-white px-3 py-1.5 text-sm hover:bg-brand-700"
            >
              Add Experience
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {resume.experience.length === 0 && (
              <p className="text-sm text-gray-600">No experience added yet.</p>
            )}
            {resume.experience.map((item, idx) => (
              <div key={item.id} className="rounded-lg border p-4 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="rounded-md border px-3 py-2"
                    placeholder="Company"
                    value={item.company}
                    onChange={(e) => updateExperienceAt(idx, { company: e.target.value })}
                  />
                  <input
                    className="rounded-md border px-3 py-2"
                    placeholder="Role"
                    value={item.role}
                    onChange={(e) => updateExperienceAt(idx, { role: e.target.value })}
                  />
                  <input
                    className="rounded-md border px-3 py-2"
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) => updateExperienceAt(idx, { location: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="rounded-md border px-3 py-2"
                      placeholder="Start (e.g., Jan 2022)"
                      value={item.startDate}
                      onChange={(e) => updateExperienceAt(idx, { startDate: e.target.value })}
                    />
                    <input
                      className="rounded-md border px-3 py-2"
                      placeholder={item.current ? 'Present' : 'End (e.g., Jun 2024)'}
                      value={item.endDate}
                      onChange={(e) => updateExperienceAt(idx, { endDate: e.target.value })}
                      disabled={item.current}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    id={`current-${item.id}`}
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) => updateExperienceAt(idx, { current: e.target.checked, endDate: e.target.checked ? '' : item.endDate })}
                  />
                  <label htmlFor={`current-${item.id}`} className="text-sm text-gray-700">I currently work here</label>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">Bullets (one per line)</label>
                  <textarea
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Drove X by Y%\nBuilt Z with A/B/C"
                    value={(item.bullets || []).join('\n')}
                    onChange={(e) => updateExperienceAt(idx, { bullets: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeExperienceAt(idx)}
                    className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="border rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
        <div className="mt-4 space-y-1 text-gray-800">
          <div className="text-lg font-semibold">{resume.profile.name}</div>
          <div className="text-sm text-gray-600">{resume.profile.title}</div>
          <div className="text-sm text-gray-600">
            {resume.profile.email} · {resume.profile.phone} · {resume.profile.location}
          </div>
          {resume.summary && (
            <p className="mt-4 text-sm leading-relaxed">{resume.summary}</p>
          )}

          {resume.experience.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-semibold tracking-wide text-gray-700">EXPERIENCE</h3>
              <div className="mt-2 space-y-3">
                {resume.experience.map((it) => (
                  <div key={it.id} className="text-sm">
                    <div className="font-medium text-gray-900">{it.role}{it.company ? `, ${it.company}` : ''}</div>
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
        </div>
      </aside>
    </main>
  )
}
