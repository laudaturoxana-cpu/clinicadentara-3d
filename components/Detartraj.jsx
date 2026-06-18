'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'

export default function Detartraj() {
  const { t } = useLang()
  const scrollRef = useRef(null)
  const stickyRef = useRef(null)
  const fillRef = useRef(null)
  const pctRef = useRef(null)
  const tartarRef = useRef(null)
  const stageRef = useRef(null)
  const hintRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const scrollEl = scrollRef.current
    const stickyEl = stickyRef.current
    if (!scrollEl || !stickyEl) return

    function onScroll() {
      const rect = scrollEl.getBoundingClientRect()
      const totalScroll = scrollEl.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const rawP = scrolled / totalScroll
      const p = Math.max(0, Math.min(1, rawP))

      // progress bar
      if (fillRef.current) fillRef.current.style.width = (p * 100).toFixed(1) + '%'
      if (pctRef.current) pctRef.current.textContent = Math.round(p * 100) + '%'

      // tartar fade out
      if (tartarRef.current) tartarRef.current.style.opacity = String(Math.max(0, 1 - p * 1.6))

      // show stage text after 10% scroll
      if (stageRef.current) {
        if (p > 0.1) stageRef.current.classList.add('active')
        else stageRef.current.classList.remove('active')
      }

      // hide scroll hint after any scroll
      if (hintRef.current) {
        if (p > 0.05) hintRef.current.classList.add('dt-hidden')
        else hintRef.current.classList.remove('dt-hidden')
      }

      // video playback rate speeds up with progress
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.5 + p * 1.5
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // auto-play video when it enters viewport
    const videoObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {})
          } else if (videoRef.current) {
            videoRef.current.pause()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (scrollRef.current) videoObs.observe(scrollRef.current)

    return () => {
      window.removeEventListener('scroll', onScroll)
      videoObs.disconnect()
    }
  }, [])

  function scrollToBooking(e) {
    e.preventDefault()
    const el = document.querySelector('#programare')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }

  return (
    <div className="dt-scroll" ref={scrollRef} data-screen-label="Detartraj">
      <div className="dt-sticky" ref={stickyRef}>
        {/* ambient rays + vignette */}
        <div className="dt-rays" aria-hidden="true"></div>
        <div className="dt-vignette" aria-hidden="true"></div>

        {/* molar video */}
        <div className="mol-wrap">
          <video
            ref={videoRef}
            className="mol-video"
            src="/assets/ealistic_human_molar_tooth_de.mp4"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="mol-tartar" ref={tartarRef} aria-hidden="true"></div>
          <div className="mol-glow" aria-hidden="true"></div>
        </div>

        {/* text stage */}
        <div className="dt-stage" ref={stageRef}>
          <div className="dt-eyebrow">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {t('dt.tag') || 'Detartraj profesional'}
          </div>
          <h2 className="dt-h2">
            {t('dt.line1') || 'Eliminăm tartrul'}<br />
            <em>{t('dt.line2') || 'în profunzime'}</em>
          </h2>
          <p className="dt-p">
            {t('dt.sub') || 'Ultrasunetele noastre acționează acolo unde periuța nu ajunge — sigur, rapid, fără durere.'}
          </p>
          <div className="dt-cta">
            <a href="#programare" className="btn btn-gold" onClick={scrollToBooking}>
              {t('hero.cta1') || 'Programează consultația'}
            </a>
          </div>
        </div>

        {/* progress meter */}
        <div className="dt-meter">
          <span className="dt-meter-label">{t('dt.meter') || 'Tartar eliminat'}</span>
          <div className="dt-meter-bar">
            <div className="dt-meter-fill" ref={fillRef}></div>
          </div>
          <span className="dt-meter-pct" ref={pctRef}>0%</span>
        </div>

        {/* scroll hint */}
        <div className="dt-hint" ref={hintRef} aria-hidden="true">
          <div className="dt-hint-line"></div>
          <span>{t('dt.hint') || 'scroll'}</span>
        </div>
      </div>
    </div>
  )
}
