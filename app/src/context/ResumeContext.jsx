import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { parseResume } from '../schema/resume'

const RESUME_STORAGE_KEY = 'ats_resume_v1'

const defaultResume = parseResume({})

const ResumeContext = createContext({
  resume: defaultResume,
  setResume: () => {},
  resetResume: () => {},
})

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    try {
      const raw = localStorage.getItem(RESUME_STORAGE_KEY)
      if (!raw) return defaultResume
      return parseResume(JSON.parse(raw))
    } catch (_) {
      return defaultResume
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume))
    } catch (_) {
      // ignore
    }
  }, [resume])

  const value = useMemo(() => ({
    resume,
    setResume,
    resetResume: () => setResume(defaultResume),
  }), [resume])

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  )
}

export function useResume() {
  return useContext(ResumeContext)
}
