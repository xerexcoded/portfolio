import assert from 'node:assert/strict'

const site = new URL(process.argv[2] ?? 'http://127.0.0.1:18081/portfolio/')
const document = await fetch(site)
assert.equal(document.status, 200, 'portfolio HTML must load')
const html = await document.text()
assert.ok(html.includes('<div id="root">'), 'React root must be present')
assert.equal(document.headers.get('cache-control'), 'no-store')

const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path.startsWith(site.pathname))
assert.ok(
  assets.some((path) => path.endsWith('.js')),
  'bundled JavaScript must be linked',
)
assert.ok(
  assets.some((path) => path.endsWith('.css')),
  'bundled CSS must be linked',
)
for (const path of assets) {
  const response = await fetch(new URL(path, site))
  assert.equal(
    response.status,
    200,
    `${path} must load through the subpath proxy`,
  )
  if (path.endsWith('.js'))
    assert.match(response.headers.get('content-type'), /javascript/)
  if (path.endsWith('.css'))
    assert.match(response.headers.get('content-type'), /text\/css/)
}

const resume = await fetch(new URL('Arnav-Banerjee-Resume.pdf', site))
assert.equal(
  resume.status,
  200,
  'resume must be downloadable by the nonroot runtime',
)
assert.match(resume.headers.get('content-type'), /application\/pdf/)
assert.equal(
  Buffer.from(await resume.arrayBuffer())
    .subarray(0, 5)
    .toString(),
  '%PDF-',
)
const health = await fetch(new URL('healthz', site))
assert.equal(health.status, 200)
assert.equal(await health.text(), 'ok\n')
const missingAsset = await fetch(new URL('assets/missing.js', site))
assert.equal(missingAsset.status, 404, 'missing assets must not receive HTML')
console.log(`Production portfolio smoke passed: ${site}`)
