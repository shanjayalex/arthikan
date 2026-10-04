import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../data/content'
import { ScrollTrigger } from '../lib/motion'
import { scrollToTarget } from '../lib/smooth'
import { Hero } from '../components/Hero'
import { Ribbon } from '../components/Ribbon'
import { Disciplines } from '../components/Disciplines'
import { WorkGrid } from '../components/WorkGrid'
import { PosterWall } from '../components/PosterWall'
import { FypFeature } from '../components/FypFeature'
import { Stats } from '../components/Stats'
import { SkillOrbit } from '../components/SkillOrbit'
import { Journey } from '../components/Journey'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    // Pins change the page height; once fonts are in, sort and recalc every trigger.
    ScrollTrigger.sort()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    if (hash) setTimeout(() => scrollToTarget(hash, { immediate: true }), 80)
  }, [hash])

  return (
    <>
      <title>{site.title}</title>
      <link rel="canonical" href={`${site.url}/`} />
      <main id="main">
        <Hero />
        <Ribbon />
        <Disciplines />
        <WorkGrid />
        <PosterWall />
        <FypFeature />
        <Stats />
        <SkillOrbit />
        <Journey />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
