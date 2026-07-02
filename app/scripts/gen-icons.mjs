// Genera los iconos PWA a partir de un SVG (brújula sobre gradiente, ver design/ASSETS_SPEC.md)
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const svg = (pad) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#14B8A6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${pad ? 0 : 112}" fill="url(#g)"/>
  <g transform="translate(256 256) scale(${pad ? 0.72 : 1})">
    <circle r="150" fill="none" stroke="#fff" stroke-width="22" opacity="0.9"/>
    <polygon points="0,-110 32,0 0,110 -32,0" fill="#fff"/>
    <circle r="26" fill="url(#g)" stroke="#fff" stroke-width="10"/>
  </g>
</svg>`

mkdirSync('public/icons', { recursive: true })

for (const [nombre, tam, maskable] of [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['icon-maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, true],
]) {
  await sharp(Buffer.from(svg(maskable))).resize(tam, tam).png().toFile(`public/icons/${nombre}`)
  console.log('✓', nombre)
}
