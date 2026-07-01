import Link from 'next/link'
import { ArrowRight, BadgeCheck, Check, ChevronRight, Mail, MapPin, Phone, Search, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function latestPostImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const image = getEditablePostImage(post)
    if (!image || image.includes('placeholder') || seen.has(image)) continue
    seen.add(image)
    out.push(image)
    if (out.length >= max) break
  }
  return out
}

function ratingSeed(post: SitePost) {
  const key = post.slug || post.id || post.title || 'x'
  let value = 0
  for (let i = 0; i < key.length; i += 1) value = (value * 33 + key.charCodeAt(i)) >>> 0
  return value
}

function ratingOf(post: SitePost) {
  const real = Number((post.content as Record<string, unknown> | undefined)?.rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((4 + (ratingSeed(post) % 8) / 10) * 10) / 10
}

function reviewCountOf(post: SitePost) {
  const real = Number((post.content as Record<string, unknown> | undefined)?.reviewCount)
  if (real > 0) return Math.floor(real)
  return 18 + (ratingSeed(post) % 140)
}

function metaBits(post: SitePost) {
  const content = post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return {
    location: typeof content.location === 'string' ? content.location : typeof content.city === 'string' ? content.city : '',
    phone: typeof content.phone === 'string' ? content.phone : typeof content.telephone === 'string' ? content.telephone : '',
  }
}

function Stars({ post }: { post: SitePost }) {
  const rating = Math.round(ratingOf(post))
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-[var(--slot4-accent-fill)] text-[var(--slot4-accent-fill)]' : 'fill-[var(--slot4-accent-soft)] text-[var(--slot4-accent-soft)]'}`} />
      ))}
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)]">
      <div className="relative min-h-[720px] w-full overflow-hidden">
        <EditableHeroCollage images={heroImages} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,27,20,0.45)_0%,rgba(24,27,20,0.66)_100%)]" />

        <div className={`relative flex min-h-[720px] flex-col justify-center ${container}`}>
          <div className="mx-auto max-w-4xl text-center text-white">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
              {pagesContent.home.hero.badge}
            </p>
            <h1 className="editable-display mt-6 text-balance text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.3rem]">
              {pagesContent.home.hero.title.join(' ')}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/86 sm:text-xl">
              {pagesContent.home.hero.description}
            </p>

            <form action="/search" className="mx-auto mt-9 flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-[1.35rem] bg-white px-5 py-4 text-[var(--slot4-page-text)]">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  placeholder={pagesContent.home.hero.searchPlaceholder}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </div>
              <button className="rounded-[1.35rem] bg-[var(--slot4-accent-fill)] px-7 py-4 text-sm font-bold text-[#23261d] transition hover:-translate-y-0.5">
                Search now
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={primaryRoute} className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#23261d] transition hover:-translate-y-0.5">
                Browse {taskLabel(primaryTask)}
              </Link>
              <Link href="/contact" className="rounded-full border border-white/25 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 3)
  const cards = [
    {
      title: 'Brand Safety',
      body: 'Keep new listings, posts, and updates easy to trust with a cleaner, more organized surface.',
      href: primaryRoute,
      icon: BadgeCheck,
    },
    {
      title: 'Viewability',
      body: 'Spotlight your newest content with homepage sections that make highlights feel more discoverable.',
      href: primaryRoute,
      icon: Search,
    },
    {
      title: 'Precise Targeting',
      body: 'Guide visitors toward the right listing, profile, or article through category-led navigation.',
      href: '/contact',
      icon: MapPin,
    },
  ]

  return (
    <section id="about" className="bg-[var(--slot4-surface-bg)]">
      <div className={`${container} py-20 sm:py-24`}>
        <div className="text-center">
          <h2 className="editable-display text-4xl font-bold tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">
            Welcome To {SITE_CONFIG.name}
          </h2>
          <div className="mx-auto mt-5 h-1.5 w-14 rounded-full bg-[var(--slot4-accent-fill)]" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon
            const post = items[index]
            const href = post ? postHref(primaryTask, post, primaryRoute) : card.href
            return (
              <Link
                key={card.title}
                href={href}
                className="group rounded-[1.8rem] border border-[var(--editable-border)] bg-white px-8 py-10 text-center shadow-[0_20px_48px_rgba(54,61,38,0.08)] transition hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(54,61,38,0.13)]"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="editable-display mt-6 text-3xl font-bold tracking-[-0.03em]">{card.title}</h3>
                <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">
                  {post ? getEditableExcerpt(post, 120) || card.body : card.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--slot4-accent)]">
                  Read more <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group relative block min-h-[520px] overflow-hidden rounded-[2rem]">
      <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,16,0.1),rgba(18,20,16,0.86))]" />
      <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white sm:p-10">
        <span className="w-fit rounded-full bg-white/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
          Featured
        </span>
        <h3 className="editable-display mt-5 max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          {post.title}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/80">{getEditableExcerpt(post, 170)}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
          Explore this post <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function CompactCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.6rem] border border-[var(--editable-border)] bg-white p-5 shadow-[0_14px_36px_rgba(54,61,38,0.08)] transition hover:-translate-y-1">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
      <h3 className="editable-display mt-3 text-2xl font-bold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
        {post.title}
      </h3>
      <div className="mt-4 flex items-center gap-3">
        <Stars post={post} />
        <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{ratingOf(post).toFixed(1)}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 110)}</p>
    </Link>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const meta = metaBits(post)
  return (
    <Link href={href} className="group grid gap-5 overflow-hidden rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-4 shadow-[0_14px_36px_rgba(54,61,38,0.08)] transition hover:-translate-y-1 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 text-3xl font-bold tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 140)}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[var(--slot4-muted-text)]">
          {meta.location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> {meta.location}</span> : null}
          {meta.phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> {meta.phone}</span> : <span>{reviewCountOf(post)} recent views</span>}
        </div>
      </div>
    </Link>
  )
}

function EditorialCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-start gap-4 rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-5 transition hover:-translate-y-1">
      <span className="editable-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-lg font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 text-2xl font-bold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 108)}</p>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_36px_rgba(54,61,38,0.08)] transition hover:-translate-y-1.5">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 text-2xl font-bold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

function HomePostShowcase({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!feed.length) return null

  const [lead, second, third, ...rest] = feed

  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} py-20 sm:py-24`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Latest posts</p>
            <h2 className="editable-display mt-3 text-4xl font-bold tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">
              Fresh posts on the homepage
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">
              New listings, stories, and updates now show directly on the home page so visitors can start browsing right away.
            </p>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--slot4-accent)]">
            See all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            {lead ? <FeaturedCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} /> : null}
            <div className="grid gap-6 md:grid-cols-2">
              {second ? <CompactCard post={second} href={postHref(primaryTask, second, primaryRoute)} /> : null}
              {third ? <CompactCard post={third} href={postHref(primaryTask, third, primaryRoute)} /> : null}
            </div>
          </div>
          <div className="grid gap-6">
            {rest.map((post, index) => (
              <HorizontalCard key={post.slug || post.id || `${post.title}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 7)
  if (!activity.length) return null

  const [featured, ...rest] = activity
  const whyBullets = [
    'Powerful sections make it easier to compare listings and spot useful updates.',
    'Search-led browsing helps visitors reach the right category faster.',
    'A warmer visual system keeps the site feeling friendly instead of generic.',
  ]

  return (
    <section id="why-us" className="bg-[var(--slot4-cream)]">
      <div className={`${container} py-20 sm:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <h2 className="editable-display text-5xl font-bold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-6xl">
              Why Choose Us
            </h2>
            <div className="mt-5 h-1.5 w-14 rounded-full bg-[var(--slot4-accent-fill)]" />
            <p className="mt-10 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
              The layout blends a clear landing-page rhythm with live content blocks, so visitors can discover new posts while still feeling guided.
            </p>
            <div className="mt-8 grid gap-4">
              {whyBullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-lg leading-8 text-[var(--slot4-muted-text)]">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--slot4-accent-fill)] text-[var(--slot4-accent-fill)]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {featured ? <FeaturedCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} /> : null}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            {rest.slice(0, 2).map((post) => (
              <HorizontalCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
          <div className="grid gap-4">
            {rest.slice(2, 5).map((post, index) => (
              <EditorialCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const timeCopy: Record<string, { title: string; description: string }> = {
  spotlight: { title: 'Fresh picks', description: 'New arrivals worth a quick look.' },
  browse: { title: 'Trending now', description: 'Popular posts and listings people are opening lately.' },
  index: { title: 'Keep browsing', description: 'More sections that help visitors stay curious.' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 4), href: primaryRoute },
          { key: 'browse', posts: posts.slice(4, 8), href: primaryRoute },
          { key: 'index', posts: posts.slice(8, 12), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = timeCopy[section.key] || { title: 'More to explore', description: 'Keep discovering new posts.' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-warm)]' : 'bg-[var(--slot4-surface-bg)]'}>
            <div className={`${container} py-18 sm:py-20`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{copy.description}</p>
                  <h2 className="editable-display mt-3 text-4xl font-bold tracking-[-0.04em] text-[var(--slot4-page-text)]">
                    {copy.title}
                  </h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--slot4-accent)]">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-6 md:grid-cols-2">
                  {section.posts.slice(0, 2).map((post) => (
                    <CompactCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {section.posts.slice(2, 4).map((post) => (
                    <ImageFirstCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  const contactCards = [
    { title: 'Phone', body: 'Use the contact page to share call-back details for your request.', icon: Phone },
    { title: 'Email', body: 'Send listing questions, update requests, or publishing notes.', icon: Mail },
    { title: 'Address', body: 'Perfect for location-led pages, local services, and directory entries.', icon: MapPin },
  ]

  return (
    <section id="contact" className="bg-[var(--slot4-surface-bg)]">
      <div className={`${container} py-20 sm:py-24`}>
        <div className="text-center">
          <h2 className="editable-display text-5xl font-bold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-6xl">
            Get In Touch
          </h2>
          <div className="mx-auto mt-5 h-1.5 w-14 rounded-full bg-[var(--slot4-accent-fill)]" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-[1.8rem] border border-[var(--editable-border)] bg-white px-8 py-10 text-center shadow-[0_20px_48px_rgba(54,61,38,0.08)]">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="editable-display mt-6 text-3xl font-bold tracking-[-0.03em] text-[var(--slot4-page-text)]">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">{card.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <EditableContactLeadForm />
        </div>
      </div>
    </section>
  )
}

export { HomePostShowcase }
