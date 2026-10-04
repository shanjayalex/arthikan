import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { ScrollTrigger } from './lib/motion'
import { scrollToTarget } from './lib/smooth'
import { PageTransitionProvider } from './components/PageTransition'
import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { ScrollProgress } from './components/ScrollProgress'
import { Preloader } from './components/Preloader'
import { NowPlayingBar } from './components/NowPlayingBar'
import { EasterEgg } from './components/EasterEgg'
import { Toast } from './components/Toast'
import Home from './pages/Home'

const FypCase = lazy(() => import('./pages/FypCase'))

function ScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) scrollToTarget(0, { immediate: true })
    const t = setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-5 text-center">
      <title>Lost signal · Arthikan Vettivel</title>
      <p className="mono">404 · Lost signal</p>
      <h1 className="display text-[clamp(3rem,12vw,10rem)]">
        Off <span className="serif-i">air.</span>
      </h1>
      <a href="/" className="rounded-full bg-lime px-6 py-3 text-ink">
        Back home
      </a>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <ScrollReset />
        <Preloader />
        <ScrollProgress />
        <Nav />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/fyp" element={<FypCase />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <NowPlayingBar />
        <EasterEgg />
        <Toast />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <Analytics />
      </PageTransitionProvider>
    </BrowserRouter>
  )
}
