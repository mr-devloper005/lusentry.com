import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Baloo 2', 'Nunito', system-ui, sans-serif"
const BODY_FONT = "'Nunito', system-ui, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#fefae0',
  surface: '#fffef7',
  raised: '#f7f2d3',
  text: '#2e3420',
  muted: '#697050',
  line: 'rgba(98, 111, 71, 0.16)',
  accent: '#626f47',
  accentSoft: '#eef2d8',
  onAccent: '#fefae0',
  glow: 'rgba(255, 207, 80, 0.22)',
  radius: '1.75rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field Notes', note: 'In-depth reads, ideas, and local stories collected in one place.' },
  listing: { ...base, kicker: 'Directory', note: 'Browse business listings with details, location cues, and quick actions.' },
  classified: { ...base, kicker: 'Listings', note: 'Fresh posts and opportunities laid out for quick scanning.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual highlights and image-led posts arranged for easy discovery.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Saved resources and useful links worth keeping close.' },
  pdf: { ...base, kicker: 'Library', note: 'Documents, downloads, and reference material in a cleaner reader.' },
  profile: { ...base, kicker: 'Profiles', note: 'People, makers, and businesses presented as a playful directory.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#a4b465',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
