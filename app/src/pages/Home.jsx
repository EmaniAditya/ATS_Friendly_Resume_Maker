import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">ATS-Friendly Resume Maker</h1>
        <p className="mt-3 text-gray-600">
          Build clean, parseable resumes with a live preview and instant export.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/builder"
            className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Build Resume
          </Link>
          <Link
            to="/preview"
            className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Preview
          </Link>
        </div>
      </section>
    </main>
  )
}
