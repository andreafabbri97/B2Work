const sharp = require('sharp')
const path = require('path')

const SIZES = [192, 512]
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons')

async function generate() {
  // Create a simple B2W icon with blue background and white text
  const svgIcon = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="96" fill="#3b82f6"/>
      <text x="256" y="300" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">B2W</text>
    </svg>
  `

  for (const size of SIZES) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`))
    console.log(`Generated icon-${size}.png`)
  }
}

generate().catch(console.error)
