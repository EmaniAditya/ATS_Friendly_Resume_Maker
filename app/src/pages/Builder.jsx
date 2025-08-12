import { useState, useEffect } from 'react'
import styles from './Builder.module.css'

export default function Builder() {
  const [resumeData, setResumeData] = useState(() => {
    // Try load from localStorage
    try {
      const saved = localStorage.getItem('resume_data')
      return saved ? JSON.parse(saved) : {
        personal: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: []
      }
    } catch {
      return { 
        personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' }, 
        summary: '', 
        experience: [], 
        education: [], 
        skills: [] 
      }
    }
  })

  // Autosave
  useEffect(() => {
    localStorage.setItem('resume_data', JSON.stringify(resumeData))
  }, [resumeData])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ATS-Friendly Resume Maker (React)</h1>
      <div className={styles.grid}>
        {/* Form */}
        <form className={styles.form}>
          {/* Personal Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Info</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                className={styles.input}
                value={resumeData.personal.name}
                onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, name: e.target.value } })}
              />
              <input
                type="text"
                placeholder="Professional Title"
                className={styles.input}
                value={resumeData.personal.title}
                onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, title: e.target.value } })}
              />
              <div className={styles.inputRow}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={resumeData.personal.email}
                  onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, email: e.target.value } })}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className={styles.input}
                  value={resumeData.personal.phone}
                  onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, phone: e.target.value } })}
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                className={styles.input}
                value={resumeData.personal.location}
                onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, location: e.target.value } })}
              />
              <div className={styles.inputRow}>
                <input
                  type="url"
                  placeholder="LinkedIn Profile"
                  className={styles.input}
                  value={resumeData.personal.linkedin}
                  onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, linkedin: e.target.value } })}
                />
                <input
                  type="url"
                  placeholder="Website/Portfolio"
                  className={styles.input}
                  value={resumeData.personal.website}
                  onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, website: e.target.value } })}
                />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <textarea
              rows={4}
              className={styles.input}
              placeholder="Write a compelling professional summary that highlights your key qualifications and career objectives..."
              value={resumeData.summary}
              onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
            />
          </section>

          {/* Skills */}
          <section>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <input
              type="text"
              placeholder="Add skills separated by commas (e.g., JavaScript, React, Node.js)"
              className={styles.input}
              value={resumeData.skills.join(', ')}
              onChange={e => {
                const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                setResumeData({ ...resumeData, skills })
              }}
            />
          </section>

          {/* Experience */}
          <section>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className={styles.experienceCard}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Job Title"
                    className={styles.input}
                    value={exp.title || ''}
                    onChange={e => {
                      const newExp = [...resumeData.experience]
                      newExp[index] = { ...newExp[index], title: e.target.value }
                      setResumeData({ ...resumeData, experience: newExp })
                    }}
                  />
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      placeholder="Company Name"
                      className={styles.input}
                      value={exp.company || ''}
                      onChange={e => {
                        const newExp = [...resumeData.experience]
                        newExp[index] = { ...newExp[index], company: e.target.value }
                        setResumeData({ ...resumeData, experience: newExp })
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., Jan 2020 - Present)"
                      className={styles.input}
                      value={exp.duration || ''}
                      onChange={e => {
                        const newExp = [...resumeData.experience]
                        newExp[index] = { ...newExp[index], duration: e.target.value }
                        setResumeData({ ...resumeData, experience: newExp })
                      }}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Job description and key achievements..."
                    className={styles.input}
                    value={exp.description || ''}
                    onChange={e => {
                      const newExp = [...resumeData.experience]
                      newExp[index] = { ...newExp[index], description: e.target.value }
                      setResumeData({ ...resumeData, experience: newExp })
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newExp = resumeData.experience.filter((_, i) => i !== index)
                      setResumeData({ ...resumeData, experience: newExp })
                    }}
                    className={styles.removeButton}
                  >
                    Remove Experience
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setResumeData({
                  ...resumeData,
                  experience: [...resumeData.experience, { title: '', company: '', duration: '', description: '' }]
                })
              }}
              className={styles.addButton}
            >
              + Add Experience
            </button>
          </section>

          {/* Education */}
          <section>
            <h2 className={styles.sectionTitle}>Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className={styles.experienceCard}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                    className={styles.input}
                    value={edu.degree || ''}
                    onChange={e => {
                      const newEdu = [...resumeData.education]
                      newEdu[index] = { ...newEdu[index], degree: e.target.value }
                      setResumeData({ ...resumeData, education: newEdu })
                    }}
                  />
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      placeholder="Institution Name"
                      className={styles.input}
                      value={edu.institution || ''}
                      onChange={e => {
                        const newEdu = [...resumeData.education]
                        newEdu[index] = { ...newEdu[index], institution: e.target.value }
                        setResumeData({ ...resumeData, education: newEdu })
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g., 2020 or 2018-2022)"
                      className={styles.input}
                      value={edu.year || ''}
                      onChange={e => {
                        const newEdu = [...resumeData.education]
                        newEdu[index] = { ...newEdu[index], year: e.target.value }
                        setResumeData({ ...resumeData, education: newEdu })
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu = resumeData.education.filter((_, i) => i !== index)
                      setResumeData({ ...resumeData, education: newEdu })
                    }}
                    className={styles.removeButton}
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setResumeData({
                  ...resumeData,
                  education: [...resumeData.education, { degree: '', institution: '', year: '' }]
                })
              }}
              className={styles.addButton}
            >
              + Add Education
            </button>
          </section>
        </form>

        {/* Live Preview */}
        <div className={styles.preview}>
          {/* Header */}
          <div className={styles.previewHeader}>
            <h1 className={styles.previewName}>{resumeData.personal.name || 'Your Name'}</h1>
            <h2 className={styles.previewTitle}>{resumeData.personal.title || 'Professional Title'}</h2>
            <div className={styles.previewContact}>
              {resumeData.personal.email && <div>{resumeData.personal.email}</div>}
              {resumeData.personal.phone && <div>{resumeData.personal.phone}</div>}
              {resumeData.personal.location && <div>{resumeData.personal.location}</div>}
              {resumeData.personal.linkedin && <div><a href={resumeData.personal.linkedin}>LinkedIn</a></div>}
              {resumeData.personal.website && <div><a href={resumeData.personal.website}>Portfolio</a></div>}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <section className={styles.previewSection}>
              <h3 className={styles.previewSectionTitle}>Professional Summary</h3>
              <p className={styles.previewText}>{resumeData.summary}</p>
            </section>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <section className={styles.previewSection}>
              <h3 className={styles.previewSectionTitle}>Skills</h3>
              <div className={styles.skillsContainer}>
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience Section Placeholder */}
          {resumeData.experience.length > 0 && (
            <section className={styles.previewSection}>
              <h3 className={styles.previewSectionTitle}>Experience</h3>
              <div className={styles.experienceContainer}>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className={styles.experienceItem}>
                    <h4 className={styles.experienceTitle}>{exp.title}</h4>
                    <p className={styles.experienceCompany}>{exp.company} • {exp.duration}</p>
                    <p className={styles.experienceDescription}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section Placeholder */}
          {resumeData.education.length > 0 && (
            <section className={styles.previewSection}>
              <h3 className={styles.previewSectionTitle}>Education</h3>
              <div className={styles.educationContainer}>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className={styles.experienceItem}>
                    <h4 className={styles.experienceTitle}>{edu.degree}</h4>
                    <p className={styles.experienceCompany}>{edu.institution} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(!resumeData.experience.length && !resumeData.education.length) && (
            <p className={styles.placeholder}>Add experience and education sections to complete your resume</p>
          )}
        </div>
      </div>
      <p className={styles.footer}>Work in progress – more sections coming soon.</p>
    </div>
  )
}
