import { z } from 'zod'

export const LinkSchema = z.object({
  label: z.string().min(1, 'Label required'),
  url: z.string().url('Invalid URL'),
})

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  current: z.boolean().optional().default(false),
  bullets: z.array(z.string()).default([]),
})

export const EducationItemSchema = z.object({
  id: z.string(),
  school: z.string().min(1),
  degree: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  details: z.string().optional().default(''),
})

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional().default(''),
  bullets: z.array(z.string()).default([]),
  links: z.array(LinkSchema).default([]),
})

export const ResumeSchema = z.object({
  profile: z.object({
    name: z.string().default(''),
    title: z.string().default(''),
    email: z.string().email('Invalid email').default(''),
    phone: z.string().default(''),
    location: z.string().default(''),
    links: z.array(LinkSchema).default([]),
  }).default({}),
  summary: z.string().default(''),
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  meta: z.object({
    template: z.enum(['classic', 'compact', 'modern']).default('classic'),
    theme: z.string().default('slate'),
    density: z.enum(['normal', 'compact']).default('normal'),
  }).default({ template: 'classic', theme: 'slate', density: 'normal' }),
})

export function parseResume(data) {
  const result = ResumeSchema.safeParse(data)
  if (result.success) return result.data
  return ResumeSchema.parse({})
}
