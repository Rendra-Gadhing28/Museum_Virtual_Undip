#!/usr/bin/env node
/**
 * Museum Virtual Undip — Texture Compression & Variant Generator
 *
 * Automatically scans texture assets and generates:
 * 1. WebP variants (high-compatibility lossy/lossless fallback)
 * 2. Resolution downsamples (1k = 1024, 2k = 2048, 4k = 4096) for adaptive GPU tiers
 *
 * Prerequisites (optional):
 *   npm install -D sharp
 * Usage:
 *   node tools/convertTextures.mjs [inputDir] [outputDir]
 */

import fs from 'node:fs'
import path from 'node:path'

const inputDir = process.argv[2] || 'public/textures'
const outputDir = process.argv[3] || 'public/textures/generated'

const RESOLUTIONS = [
  { name: '1k', maxDim: 1024, quality: 80 },
  { name: '2k', maxDim: 2048, quality: 85 },
  { name: '4k', maxDim: 4096, quality: 90 },
]

async function run() {
  console.log('🏛️  [Undip Texture Converter] Scanning directory:', inputDir)

  if (!fs.existsSync(inputDir)) {
    console.log(`ℹ️  Directory "${inputDir}" does not exist yet. Procedural textures are used by default.`)
    process.exit(0)
  }

  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('⚠️  Sharp library is not installed. To run texture conversion, install sharp: npm i -D sharp')
    console.warn('Procedural canvas textures are currently active and optimized.')
    process.exit(0)
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const files = fs.readdirSync(inputDir).filter((f) => /\.(png|jpe?g|bmp)$/i.test(f))
  if (files.length === 0) {
    console.log('No raster texture files found in', inputDir)
    return
  }

  for (const file of files) {
    const srcPath = path.join(inputDir, file)
    const baseName = path.parse(file).name
    console.log(`Processing: ${file}`)

    for (const res of RESOLUTIONS) {
      const outPath = path.join(outputDir, `${baseName}_${res.name}.webp`)
      try {
        await sharp(srcPath)
          .resize({ width: res.maxDim, height: res.maxDim, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: res.quality })
          .toFile(outPath)
        const stat = fs.statSync(outPath)
        console.log(`  ✓ Created ${baseName}_${res.name}.webp (${Math.round(stat.size / 1024)} KB)`)
      } catch (err) {
        console.error(`  ✗ Error converting ${file} to ${res.name}:`, err.message)
      }
    }
  }

  console.log('✅ Texture conversion complete.')
}

run().catch(console.error)
