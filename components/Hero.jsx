'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLang } from '@/context/LangContext'

export default function Hero() {
  const { t } = useLang()
  const statsRef = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    // Parallax
    const orb1 = document.querySelector('.orb-1')
    const orb2 = document.querySelector('.orb-2')
    const onScroll = () => {
      const y = window.scrollY
      if (y < window.innerHeight) {
        if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`
        if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Counter animation
    const targets = [10, 2500, 98]
    const suffixes = ['+', '+', '%']
    const els = statsRef.current?.querySelectorAll('strong')
    if (!els) return

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          els.forEach((el, i) => {
            const target = targets[i]
            const suffix = suffixes[i]
            const start = performance.now()
            const tick = (now) => {
              const p = Math.min((now - start) / 1800, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              el.textContent = Math.floor(eased * target) + suffix
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          })
          obs.disconnect()
        }
      })
    }, { threshold: 0.3 })

    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  function handleScroll(e, href) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }

  return (
    <section id="hero" data-screen-label="01 Hero">
      <div className="hero-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="hero-grid-lines"></div>
      </div>

      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-eyebrow reveal-up">
            <span className="eyebrow-dot"></span>
            <span>{t('hero.eyebrow')}</span>
          </div>
          <h1 className="hero-h1 reveal-up" style={{ '--d': '.1s' }}>
            <span>{t('hero.line1')}</span><br />
            <em>{t('hero.line2')}</em>
          </h1>
          <p className="hero-sub reveal-up" style={{ '--d': '.2s' }}>{t('hero.sub')}</p>
          <div className="hero-btns reveal-up" style={{ '--d': '.3s' }}>
            <a href="#programare" className="btn btn-gold btn-lg" onClick={e => handleScroll(e, '#programare')}>{t('hero.cta1')}</a>
            <a href="#servicii" className="btn btn-ghost btn-lg" onClick={e => handleScroll(e, '#servicii')}>{t('hero.cta2')}</a>
          </div>
          <div className="hero-stats reveal-up" style={{ '--d': '.4s' }} ref={statsRef}>
            <div className="hstat"><strong>10+</strong><span>{t('hero.s1')}</span></div>
            <div className="hstat-sep"></div>
            <div className="hstat"><strong>2500+</strong><span>{t('hero.s2')}</span></div>
            <div className="hstat-sep"></div>
            <div className="hstat"><strong>98%</strong><span>{t('hero.s3')}</span></div>
          </div>
        </div>

        <div className="hero-visual reveal-right" style={{ '--d': '.2s' }}>
          <div className="hv-photo-frame">
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85"
              alt="Zâmbet perfect după tratament"
              fill style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
            />
          </div>
          <div className="hv-badge hv-b1">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 18s-7-5-7-10a7 7 0 0114 0c0 5-7 10-7 10z"/></svg>
            <span>{t('hero.b1')}</span>
          </div>
          <div className="hv-badge hv-b2">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><circle cx="10" cy="10" r="8"/></svg>
            <span>{t('hero.b2')}</span>
          </div>
          <div className="hv-badge hv-b3">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M7 4V2M13 4V2M3 9h14"/></svg>
            <span>{t('hero.b3')}</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line"></div>
        <span>{t('hero.scroll')}</span>
      </div>
    </section>
  )
}
