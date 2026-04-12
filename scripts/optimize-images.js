const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public', 'images')
const sources = ['hero-people-source.png', 'hero-people-source.jpg', 'hero-people-source.jpeg', 'hero-people-source.webp']

async function run() {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

  let sourceFile = null
  for (const s of sources) {
    const p = path.join(publicDir, s)
    if (fs.existsSync(p)) {
      sourceFile = p
      break
    }
  }

  if (!sourceFile) {
    console.error('Nessun file sorgente trovato. Carica la tua immagine in public/images/ con uno di questi nomi:')
    console.error(sources.join('\n'))
    process.exit(1)
  }

  console.log('Source image:', sourceFile)

  const sizes = [640, 1280, 1920]
  for (const size of sizes) {
    const out = path.join(publicDir, `hero-people-${size}.webp`)
    console.log(`Generating ${path.basename(out)} (${size}px) ...`)
    await sharp(sourceFile).resize({ width: size }).webp({ quality: 80 }).toFile(out)
  }

  // Generate full sized webp as hero-people.webp
  const outFull = path.join(publicDir, `hero-people.webp`)
  await sharp(sourceFile).webp({ quality: 80 }).toFile(outFull)

  // Generate small blur placeholder
  const blurBuf = await sharp(sourceFile).resize({ width: 20 }).webp({ quality: 50 }).toBuffer()
  const blurData = `data:image/webp;base64,${blurBuf.toString('base64')}`
  fs.writeFileSync(path.join(publicDir, 'hero-people-blur.txt'), blurData)

  console.log('Generated optimized images and placeholder in public/images/')
  console.log('Next: import /images/hero-people-1280.webp in Hero (done automatically by the project changes I will add).')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
