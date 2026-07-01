'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="editable-display block truncate text-3xl font-bold leading-none text-white">{SITE_CONFIG.name}</span>
            <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55 md:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-6 lg:flex">
          {primaryNav.map((item) => {
            const active = item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-semibold transition ${
                  active ? 'text-white' : 'text-white/72 hover:text-white'
                }`}
              >
                {item.label}
                <span className={`absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[var(--slot4-accent-fill)] transition ${active ? 'opacity-100' : 'opacity-0'}`} />
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <form action="/search" className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2">
            <Search className="h-4 w-4 text-white/68" />
            <input
              name="q"
              type="search"
              placeholder="Search"
              className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
          </form>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {session ? (
            <>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-bold text-[#23261d] transition hover:-translate-y-0.5"
              >
                <PlusCircle className="h-4 w-4" /> Create
              </Link>
              <button type="button" onClick={logout} className="px-3 py-2 text-sm font-semibold text-white/75 transition hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 px-3 py-2 text-sm font-semibold text-white/75 transition hover:text-white md:inline-flex">
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-bold text-[#23261d] transition hover:-translate-y-0.5 md:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto rounded-full border border-white/12 bg-white/8 p-2.5 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#24281d] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-3">
            <Search className="h-4 w-4 text-white/68" />
            <input name="q" type="search" placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45" />
          </form>

          <div className="grid gap-1">
            {[...primaryNav, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-white text-[#23261d]' : 'text-white/75 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button type="button" onClick={logout} className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white/75 transition hover:bg-white/8 hover:text-white">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
