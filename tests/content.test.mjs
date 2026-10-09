import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const repositories = JSON.parse(
  await readFile(
    new URL('../src/data/repositories.json', import.meta.url),
    'utf8',
  ),
)

test('repository snapshot contains unique original project links', () => {
  assert.ok(repositories.length >= 3)
  assert.equal(
    new Set(repositories.map((repo) => repo.name)).size,
    repositories.length,
  )
  for (const repo of repositories) {
    const url = new URL(repo.url)
    assert.equal(url.protocol, 'https:')
    assert.equal(url.hostname, 'github.com')
    assert.equal(decodeURIComponent(url.pathname), `/xerexcoded/${repo.name}`)
    assert.equal(typeof repo.description, 'string')
    assert.equal(typeof repo.language, 'string')
    assert.equal(typeof repo.archived, 'boolean')
  }
})

test('all three verified pinned projects are represented in the directory', () => {
  for (const name of ['pplx-cli', 'xikoi', 'ring-of-fire']) {
    assert.ok(
      repositories.some((repo) => repo.name === name),
      `Missing pinned repository: ${name}`,
    )
  }
})

test('the published resume is a PDF, and the hero asset is a WebP', async () => {
  const resume = await readFile(
    new URL('../public/Arnav-Banerjee-Resume.pdf', import.meta.url),
  )
  assert.equal(resume.subarray(0, 5).toString(), '%PDF-')
  const hero = await readFile(
    new URL('../public/images/solarpunk-orbit.webp', import.meta.url),
  )
  assert.equal(hero.subarray(0, 4).toString(), 'RIFF')
  assert.equal(hero.subarray(8, 12).toString(), 'WEBP')
  assert.ok(hero.length < 500_000, 'Hero should stay below 500KB')
})
