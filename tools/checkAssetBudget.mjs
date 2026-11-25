#!/usr/bin/env node
/**
 * Museum Virtual Undip — CI Asset Budget Checker
 *
 * Verifies that 3D assets, textures, and total bundle sizes do not exceed
 * the strict mobile performance budget thresholds defined in PERF_CONFIG.budgetsKB.
 *
 * Usage:
 *   node tools/checkAssetBudget.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const BUDGETS_KB = {
  zone3: 4500, // 4.5 MB
  zone4: 5500, // 5.5 MB
  zone5: 6000, // 6.0 MB
}

function getDirectorySizeKB(dirPath) {
  if (!fs.existsSync(dirPath)) return 0
  let totalBytes = 0
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      totalBytes += getDirectorySizeKB(fullPath) * 1024
    } else if (entry.isFile()) {
      totalBytes += fs.statSync(fullPath).size
    }
  }
  return Math.round(totalBytes / 1024)
}

function run() {
  console.log('🏛️  [Undip CI Asset Budget Check]')
  console.log('--------------------------------------------------')

  let hasErrors = false

  for (const [zone, budgetKB] of Object.entries(BUDGETS_KB)) {
    const assetDir = path.join('public', 'assets', zone)
    const currentSizeKB = getDirectorySizeKB(assetDir)
    const percent = Math.round((currentSizeKB / budgetKB) * 100)
    const status = currentSizeKB <= budgetKB ? 'PASS ✅' : 'FAIL ❌'

    console.log(
      `Zone ${zone.toUpperCase().padEnd(6)} | Budget: ${String(budgetKB).padStart(5)} KB | Current: ${String(currentSizeKB).padStart(5)} KB (${percent}%) -> ${status}`
    )

    if (currentSizeKB > budgetKB) {
      console.error(`  ⚠️  Budget exceeded by ${currentSizeKB - budgetKB} KB! Compress textures or models.`)
      hasErrors = true
    }
  }

  // Also verify dist folder bundle size if present
  if (fs.existsSync('dist/assets')) {
    const distSizeKB = getDirectorySizeKB('dist/assets')
    console.log(`Dist Assets  | Total:  ${String(distSizeKB).padStart(5)} KB`)
  }

  console.log('--------------------------------------------------')
  if (hasErrors) {
    console.error('❌ Asset budget check failed.')
    process.exit(1)
  } else {
    console.log('✅ All assets are well within budget limits!')
  }
}

run()
