/** Static stand-in for the 3D sphere (mobile, reduced motion, no WebGL). */
export function SignalFallback({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      {[30, 46, 62, 78, 94].map((r, i) => (
        <circle key={r} r={r} fill="none" stroke={i === 2 ? 'var(--color-lime)' : 'var(--line)'} strokeWidth={i === 2 ? 1.2 : 0.6} strokeDasharray={i % 2 ? '2 4' : undefined} />
      ))}
    </svg>
  )
}
