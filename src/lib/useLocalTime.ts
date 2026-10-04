import { useEffect, useState } from 'react'
import { site } from '../data/content'

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: site.timeZone })
    .format(new Date())
    .toUpperCase()

/** Live Sri Lanka time, updated every 15s. */
export function useLocalTime() {
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return t
}
