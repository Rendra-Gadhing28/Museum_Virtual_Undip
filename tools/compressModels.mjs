#!/usr/bin/env node
/**
 * Museum Virtual Undip — 3D Model Optimization Pipeline
 *
 * Utilizes @gltf-transform/cli to compress raw GLB/GLTF models:
 * 1. dedup: Remove duplicate accessors and materials
 * 2. prune: Remove unused nodes, meshes, textures
 * 3. weld: Weld duplicate vertices
 * 4. reorder: Optimize GPU vertex cache locality
 * 5. draco / meshopt: Compress geometry stream
 *
 * Usage:
 *   node tools/compressModels.mjs --input ./raw-models --output ./public/assets/models --type meshopt
 */

import { readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, extname, basename } from 'path'
import { execSync } from 'child_process'

const args = process.argv.slice(2)
const inputDir = getArg('--input') || './assets-raw'
const outputDir = getArg('--output') || './public/assets/models'
const compressionType = getArg('--type') || 'meshopt' // 'meshopt' | 'draco'

function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : null
}

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

if (!existsSync(inputDir)) {
  console.log(`[compressModels] Direktori input "${inputDir}" belum ada. Pipeline siap saat aset GLB diimpor.`)
  process.exit(0)
}

const files = readdirSync(inputDir).filter((f) => ['.glb', '.gltf'].includes(extname(f).toLowerCase()))

if (files.length === 0) {
  console.log(`[compressModels] Tidak ada file GLB/GLTF di ${inputDir}.`)
  process.exit(0)
}

console.log(`\n=== Mengoptimalkan ${files.length} Model 3D dengan ${compressionType.toUpperCase()} ===\n`)

for (const file of files) {
  const inPath = join(inputDir, file)
  const outPath = join(outputDir, `${basename(file, extname(file))}.compressed.glb`)
  const inSizeMB = (statSync(inPath).size / (1024 * 1024)).toFixed(2)

  console.log(`Memproses: ${file} (${inSizeMB} MB)...`)

  try {
    const cmd = `npx @gltf-transform/cli optimize "${inPath}" "${outPath}" --compress ${compressionType}`
    execSync(cmd, { stdio: 'inherit' })
    const outSizeMB = (statSync(outPath).size / (1024 * 1024)).toFixed(2)
    const ratio = Math.round((1 - outSizeMB / inSizeMB) * 100)
    console.log(`✓ Selesai: ${outPath} (${outSizeMB} MB) — Hemat ${ratio}%\n`)
  } catch (err) {
    console.error(`✗ Gagal memproses ${file}:`, err.message)
  }
}

console.log('=== Kompresi Model 3D Selesai ===\n')
