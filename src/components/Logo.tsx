// The AV monogram, traced from the portfolio logo so it can take any colour.
export function Logo({ className = '', title = 'Arthikan Vettivel' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="340 360 345 305" className={className} role="img" aria-label={title} fill="currentColor">
      <polygon points="483,367 541,367 573,436 539,507 512,452 486,507 451,436" />
      <polygon points="497,533 528,533 512,566" />
      <polygon points="426,491 473,593 444,593 414,657 347,657" />
      <polygon points="598,491 677,657 609,657 580,593 551,593" />
    </svg>
  )
}
