'use client'
import { useEffect } from 'react'
import Navbar       from '@/components/Navbar'
import Hero         from '@/components/Hero'
import TrustBar     from '@/components/TrustBar'
import Services     from '@/components/Services'
import About        from '@/components/About'
import Technology   from '@/components/Technology'
import BeforeAfter  from '@/components/BeforeAfter'
import Pricing      from '@/components/Pricing'
import Testimonials from '@/components/Testimonials'
import FAQ          from '@/components/FAQ'
import Booking      from '@/components/Booking'
import Contact      from '@/components/Contact'
import Footer       from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import CookieBanner from '@/components/CookieBanner'
import ToothStage   from '@/components/ToothStage'
import Story        from '@/components/Story'
import Detartraj    from '@/components/Detartraj'

export default function Home() {
  // Scroll reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

    const observe = () => {
      document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => obs.observe(el))
    }

    // Observe immediately and after a short delay (for dynamic content)
    observe()
    const timer = setTimeout(observe, 500)
    return () => { obs.disconnect(); clearTimeout(timer) }
  }, [])

  // Subtle card tilt
  useEffect(() => {
    function addTilt(selector) {
      document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect()
          const x = (e.clientX - rect.left - rect.width / 2) / rect.width
          const y = (e.clientY - rect.top - rect.height / 2) / rect.height
          card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`
        })
        card.addEventListener('mouseleave', () => { card.style.transform = '' })
      })
    }
    const timer = setTimeout(() => {
      addTilt('.scard')
      addTilt('.pcard')
      addTilt('.tech-card')
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <ToothStage />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Story />
        <Detartraj />
        <Services />
        <About />
        <Technology />
        <BeforeAfter />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  )
}
