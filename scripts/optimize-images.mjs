// Turns the high-res PNGs in /raw into web-ready WebP files in /public.
// Run: npm run images   (re-run whenever you drop new work into /raw)
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const RAW = 'raw'
const PORTRAITS = ['arthikan-suit', 'arthikan-casual']
const SKIP = ['fyp-logo', 'av-logo'] // handled separately below

await mkdir('public/work', { recursive: true })
await mkdir('public/images', { recursive: true })
await mkdir('public/fyp', { recursive: true })

const files = (await readdir(RAW)).filter((f) => /\.(png|jpe?g)$/i.test(f))

for (const file of files) {
  const name = path.parse(file).name
  if (SKIP.includes(name)) continue
  const outDir = PORTRAITS.includes(name) ? 'public/images' : 'public/work'
  for (const width of [720, 1400]) {
    await sharp(path.join(RAW, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${outDir}/${name}-${width}.webp`)
  }
  console.log('✓', name)
}

// FYP logo: white + lime on black → same artwork on transparent.
// Black background becomes alpha; colours are un-premultiplied so the edges stay clean.
{
  const { data, info } = await sharp(path.join(RAW, 'fyp-logo.png'))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  let lime = { r: 0, g: 0, b: 0, n: 0 }
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const a = Math.max(r, g, b)
    if (a > 0) {
      data[i] = Math.min(255, Math.round((r / a) * 255))
      data[i + 1] = Math.min(255, Math.round((g / a) * 255))
      data[i + 2] = Math.min(255, Math.round((b / a) * 255))
    }
    data[i + 3] = a < 18 ? 0 : a
    // sample the saturated green dot for the brand hex
    if (g > 200 && r > 120 && r < 230 && b < 60) {
      lime.r += r; lime.g += g; lime.b += b; lime.n++
    }
  }
  await sharp(data, { raw: info })
    .trim()
    .resize({ width: 640 })
    .png()
    .toFile('public/fyp/fyp-logo.png')
  if (lime.n) {
    const hex = [lime.r, lime.g, lime.b]
      .map((v) => Math.round(v / lime.n).toString(16).padStart(2, '0'))
      .join('')
    console.log('FYP lime sampled from logo: #' + hex.toUpperCase())
  }
}

// Open Graph image 1200×630: cream, suit portrait right, name left.
{
  const portrait = await sharp(path.join(RAW, 'arthikan-suit.png'))
    .resize(560, 630, { fit: 'cover', position: 'top' })
    .toBuffer()
  const text = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#F7F7F2"/>
      <text x="64" y="96" font-family="Menlo, monospace" font-size="20" letter-spacing="4" fill="#8A8A84">ARTHIKAN.CLICK</text>
      <text x="60" y="270" font-family="Helvetica Neue, Arial" font-weight="900" font-size="104" fill="#0E0F0C" letter-spacing="-3">ARTHIKAN</text>
      <text x="60" y="370" font-family="Helvetica Neue, Arial" font-weight="900" font-size="104" fill="#0E0F0C" letter-spacing="-3">VETTIVEL</text>
      <text x="64" y="440" font-family="Helvetica Neue, Arial" font-size="28" fill="#0E0F0C">Marketing · Design · Web · Host of FYP</text>
      <g transform="translate(604 96)" stroke="#0E0F0C" stroke-width="9" stroke-linecap="round">
        <line x1="0" y1="-34" x2="0" y2="34"/><line x1="-34" y1="0" x2="34" y2="0"/>
        <line x1="-24" y1="-24" x2="24" y2="24"/><line x1="-24" y1="24" x2="24" y2="-24"/>
      </g>
      <rect x="64" y="520" width="120" height="6" fill="#BAF709"/>
    </svg>`)
  await sharp(text)
    .composite([{ input: portrait, left: 640, top: 0 }])
    .jpeg({ quality: 86 })
    .toFile('public/og-image.jpg')
  console.log('✓ og-image.jpg')
}
