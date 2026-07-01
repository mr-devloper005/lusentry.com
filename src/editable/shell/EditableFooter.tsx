'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.85fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/8">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
              </span>
              <span className="editable-display text-4xl font-bold leading-none">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/64">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
              {globalContent.footer?.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Navigate</h3>
            <div className="mt-5 grid gap-3">
              {[['Home', '/'], ['About', '/about'], ['Why Us', '/#why-us'], ['Contact', '/contact'], ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']])].map(([label, href]) => (
                <Link key={`${label}-${href}`} href={href} className="text-sm font-semibold text-white/68 transition hover:text-white">
                  {label}
                </Link>
              ))}
              {session ? <button type="button" onClick={logout} className="text-left text-sm font-semibold text-white/68 transition hover:text-white">Logout</button> : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Reach Out</h3>
            <div className="mt-5 grid gap-4 text-sm text-white/68">
              <p className="inline-flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-[var(--slot4-accent-fill)]" /> Share a question, listing idea, or collaboration note.</p>
              <p className="inline-flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-[var(--slot4-accent-fill)]" /> Use the contact page to send details through the existing workflow.</p>
              <p className="inline-flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-[var(--slot4-accent-fill)]" /> Built for visitors who want a friendlier way to browse public posts.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[var(--slot4-accent-fill)]">
                Open contact page <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>{globalContent.footer?.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
