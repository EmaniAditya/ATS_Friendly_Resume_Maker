import { useResume } from '../context/ResumeContext'

export default function Builder() {
  const { resume, setResume } = useResume()

  function update(field, value) {
    setResume({ ...resume, [field]: value })
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
        </div>
      </aside>
    </main>
  )
}
