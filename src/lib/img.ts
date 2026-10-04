// Images are exported by scripts/optimize-images.mjs as `<name>-720.webp` and `<name>-1400.webp`.
export const srcSet = (base: string) => `${base}-720.webp 720w, ${base}-1400.webp 1400w`
export const src = (base: string, size: 720 | 1400 = 720) => `${base}-${size}.webp`
