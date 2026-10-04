import { track as vercelTrack } from '@vercel/analytics'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

type Event = 'cv_download' | 'email_copy' | 'whatsapp_click' | 'fyp_click' | 'trailer_play' | 'contact_submit'

export function track(name: Event, props?: Record<string, string | number>) {
  try {
    vercelTrack(name, props)
  } catch {
    /* analytics must never break the page */
  }
  window.gtag?.('event', name, props)
}

/** Loads GA4 only when VITE_GA_ID is set (see README). */
export function initGA() {
  const id = import.meta.env.VITE_GA_ID as string | undefined
  if (!id) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id)
}
