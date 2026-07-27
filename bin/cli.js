#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, copyFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function listAvailable() {
  return loadJson(join(pkgRoot, 'registry', 'registry.json')).items.map((item) => item.name)
}

function printUsage() {
  console.error('Usage: kyro-datatable add <renderer> <target-dir> [--force]')
  console.error(`Available renderers: ${listAvailable().join(', ')}`)
}

function detectPackageManager() {
  if (existsSync(resolve(process.cwd(), 'bun.lock')) || existsSync(resolve(process.cwd(), 'bun.lockb'))) return 'bun add'
  if (existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm add'
  if (existsSync(resolve(process.cwd(), 'yarn.lock'))) return 'yarn add'
  return 'npm install'
}

const [command, name, target, ...rest] = process.argv.slice(2)
const force = rest.includes('--force')

if (command !== 'add' || !name || !target) {
  printUsage()
  process.exit(1)
}

const itemPath = join(pkgRoot, 'registry', `${name}.json`)
if (!existsSync(itemPath)) {
  console.error(`No renderer named "${name}".`)
  printUsage()
  process.exit(1)
}

const item = loadJson(itemPath)
const targetDir = resolve(process.cwd(), target)

let copied = 0
let skipped = 0
for (const file of item.files) {
  const src = join(pkgRoot, file.path)
  const dest = join(targetDir, file.target)
  if (existsSync(dest) && !force) {
    console.warn(`skip (exists): ${file.target}`)
    skipped++
    continue
  }
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  console.log(`copied: ${file.target}`)
  copied++
}

console.log(`\n${copied} file(s) copied to ${target}${skipped ? `, ${skipped} skipped (already exist — use --force to overwrite)` : ''}.`)

if (item.dependencies?.length) {
  console.log(`\nInstall dependencies:\n  ${detectPackageManager()} ${item.dependencies.join(' ')}`)
}
