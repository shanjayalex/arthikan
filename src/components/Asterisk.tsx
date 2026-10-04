export function Asterisk({ className = '', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="-50 -50 100 100" className={`${spin ? 'spin-slow' : ''} ${className}`} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="11" strokeLinecap="round">
        <line x1="0" y1="-40" x2="0" y2="40" />
        <line x1="-40" y1="0" x2="40" y2="0" />
        <line x1="-28" y1="-28" x2="28" y2="28" />
        <line x1="-28" y1="28" x2="28" y2="-28" />
      </g>
    </svg>
  )
}
