'use client'
import Image from 'next/image'
import { useLang } from '@/context/LangContext'

const TECH = [
  { key: 'tc1', img: 'https://images.unsplash.com/photo-1538108149393-dbee39b67f8b?auto=format&fit=crop&w=600&q=80' },
  { key: 'tc2', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80' },
  { key: 'tc3', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80' },
  { key: 'tc4', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80' },
]

export default function Technology() {
  const { t } = useLang()
  return (
    <section id="tehnologie" className="section bg-white" data-screen-label="05 Tehnologie">
      <div className="container">
        <div className="section-head reveal-up">
          <span className="tag">{t('tc.tag')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('tc.title').replace('\n', '<br>') }} />
          <p>{t('tc.sub')}</p>
        </div>
        <div className="tech-grid">
          {TECH.map(({ key, img }, i) => (
            <div key={key} className="tech-card reveal-up" style={{ '--d': `${i * 0.1}s` }}>
              <div className="tech-img" style={{ position: 'relative', aspectRatio: '4/3' }}>
                <Image src={img} alt={t(`${key}.t`)} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="tech-body">
                <h4>{t(`${key}.t`)}</h4>
                <p>{t(`${key}.d`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
