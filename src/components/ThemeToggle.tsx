import { toggleTheme, useTheme } from '../lib/theme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme()
  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-sm transition-colors hover:border-[var(--fg)] ${className}`}
      data-magnetic
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  )
}
