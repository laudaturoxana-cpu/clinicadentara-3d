'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'

const BEATS = [
  {
    id: 'b1',
    lineKey: 'story.b1',
    fallback: 'Tartrul se depune <em>tăcut</em>',
    ice: 0,
  },
  {
    id: 'b2',
    lineKey: 'story.b2',
    fallback: 'Bacteriile prosperă <em>în întuneric</em>',
    ice: 0.25,
  },
  {
    id: 'b3',
    lineKey: 'story.b3',
    fallback: 'Dar noi îl eliminăm cu <em>precizie</em>',
    ice: 0.65,
  },
]

export default function Story() {
  const { t } = useLang()
  const sectionRef = useRef(null)
  const iceCleanRef = useRef(null)
  const sparkleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const beats = section.querySelectorAll('.story-beat')
    const iceClean = iceCleanRef.current
    const sparkle = sparkleRef.current

    // IntersectionObserver for beat animations
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in')
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    beats.forEach(b => obs.observe(b))

    // Scroll-driven ice reveal
    function onScroll() {
      if (!iceClean) return
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const totalH = section.offsetHeight

      // progress 0→1 across the whole story section
      const raw = (-rect.top) / (totalH - vh)
      const p = Math.max(0, Math.min(1, raw))

      // reveal the clean tooth from bottom upward
      const pct = Math.round(Math.max(0, 100 - p * 120))
      iceClean.style.clipPath = `inset(0 0 ${pct}% 0)`

      // sparkle when almost fully clean
      if (sparkle) sparkle.style.opacity = p > 0.7 ? String(Math.min(1, (p - 0.7) / 0.2)) : '0'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function getLine(beat) {
    try {
      const val = t(beat.lineKey)
      if (val && val !== beat.lineKey) return val
    } catch {}
    return beat.fallback
  }

  return (
    <section className="story" ref={sectionRef} data-screen-label="Story">
      {/* fixed-position tooth photo (inside section's stacking) */}
      <div className="ice-wrap">
        <img
          src="/assets/molar_tex.png"
          alt=""
          className="ice-img"
          aria-hidden="true"
        />
        <img
          src="/assets/molar_clean.png"
          alt=""
          className="ice-img ice-clean"
          aria-hidden="true"
          ref={iceCleanRef}
        />
        <div className="ice-sparkle" ref={sparkleRef} aria-hidden="true"></div>
      </div>

      <div className="story-track">
        {BEATS.map(beat => (
          <div key={beat.id} className="story-beat sb-left">
            <p
              className="story-line"
              dangerouslySetInnerHTML={{ __html: getLine(beat) }}
            />
          </div>
        ))}

        {/* final beat — CTA */}
        <div className="story-beat story-final sb-center">
          <h2 className="story-h2">
            {t('story.finalLine1') || 'Zâmbetul tău merită'}
            <br />
            <em>{t('story.finalLine2') || 'cel mai bun start'}</em>
          </h2>
          <a
            href="#programare"
            className="btn btn-gold btn-lg"
            onClick={e => {
              e.preventDefault()
              const el = document.querySelector('#programare')
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
            }}
          >
            {t('hero.cta1') || 'Programează consultația'}
          </a>
        </div>
      </div>
    </section>
  )
}
