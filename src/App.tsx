import { useEffect, useRef, useState } from 'react'
import { capabilities, experience, projects } from './data/profile'
import type { Project, ProjectCategory } from './data/profile'
import repositories from './data/repositories.json'

const github = 'https://github.com/xerexcoded'
const email = 'arnavbanerjee61@gmail.com'
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

function Arrow({
  diagonal = false,
  className = '',
}: {
  diagonal?: boolean
  className?: string
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-7-7 7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
      <Arrow diagonal />
    </a>
  )
}

function ProjectArt({ kind }: { kind: Project['kind'] }) {
  if (kind === 'terminal')
    return (
      <div className="project-art terminal-art" aria-hidden="true">
        <div className="mini-terminal">
          <div className="mini-terminal-top">
            <span />
            <span />
            <span />
            <b>xikoi / local workspace</b>
          </div>
          <div className="mini-terminal-body">
            <span className="terminal-muted">MODELS</span>
            <div className="model-line">
              ◉ &nbsp; ollama <span>local</span>
            </div>
            <div className="model-line dim">&nbsp; &nbsp; conversations</div>
            <hr />
            <span className="terminal-muted">YOU</span>
            <p>Let's think this through.</p>
            <span className="terminal-muted">ASSISTANT</span>
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="terminal-cursor" />
          </div>
          <div className="mini-terminal-footer">
            ↑↓ navigate <span>↵ select</span> <span>q quit</span>
          </div>
        </div>
        <span className="art-caption">
          LOCAL MODELS. HUMAN-SIZED INTERFACE.
        </span>
      </div>
    )
  if (kind === 'globe')
    return (
      <div className="project-art globe-art" aria-hidden="true">
        <svg viewBox="0 0 560 350">
          <defs>
            <radialGradient id="globe-fill">
              <stop stopColor="#e6ead9" />
              <stop offset="1" stopColor="#bec9ac" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx="280" cy="174" r="125" />
            </clipPath>
          </defs>
          <circle cx="280" cy="174" r="125" fill="url(#globe-fill)" />
          <g
            clipPath="url(#globe-clip)"
            fill="none"
            stroke="#6d8564"
            strokeWidth="0.7"
            opacity="0.6"
          >
            {[-95, -55, 0, 55, 95].map((v) => (
              <ellipse
                key={v}
                cx="280"
                cy="174"
                rx={Math.abs(v) || 12}
                ry="125"
                transform="rotate(-20 280 174)"
              />
            ))}
            {[70, 115, 160, 205, 250].map((y) => (
              <ellipse
                key={y}
                cx="280"
                cy={y}
                rx="140"
                ry="27"
                transform="rotate(-20 280 174)"
              />
            ))}
          </g>
          <path
            d="m293 58-17 32 27 29-19 28 25 27-7 38 32 39-7 39"
            stroke="#496849"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 5"
          />
          {[
            [293, 69],
            [279, 100],
            [298, 128],
            [285, 155],
            [309, 184],
            [302, 211],
            [325, 246],
            [320, 268],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#4c714f" opacity="0.13" />
              <circle cx={x} cy={y} r="2.5" fill="#375a3d" />
            </g>
          ))}
          <ellipse
            cx="280"
            cy="174"
            rx="184"
            ry="49"
            transform="rotate(-26 280 174)"
            fill="none"
            stroke="#8b9f7e"
            strokeWidth="0.7"
          />
          <path d="M45 95h94M425 247h90" stroke="#8b9f7e" strokeWidth="0.7" />
          <text
            x="45"
            y="87"
            fill="#4d6850"
            fontSize="9"
            fontFamily="monospace"
          >
            40.0° N / 140.0° E
          </text>
          <text
            x="426"
            y="264"
            fill="#4d6850"
            fontSize="9"
            fontFamily="monospace"
          >
            EXPLORE THE EARTH
          </text>
        </svg>
        <span className="art-caption">
          GEOSPATIAL DATA → VISUAL UNDERSTANDING
        </span>
      </div>
    )
  return (
    <div className="project-art graph-art" aria-hidden="true">
      <svg viewBox="0 0 560 350">
        <g stroke="#54765b" strokeWidth="1" opacity="0.5">
          {[
            [280, 175, 130, 100],
            [280, 175, 410, 100],
            [280, 175, 430, 245],
            [280, 175, 155, 255],
            [130, 100, 70, 190],
            [410, 100, 465, 45],
            [155, 255, 245, 310],
            [410, 100, 430, 245],
          ].map((p, i) => (
            <path key={i} d={`M${p[0]} ${p[1]}L${p[2]} ${p[3]}`} />
          ))}
        </g>
        {[
          [130, 100, 9],
          [410, 100, 12],
          [430, 245, 8],
          [155, 255, 12],
          [70, 190, 5],
          [465, 45, 5],
          [245, 310, 5],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#91ac74" />
        ))}
        <circle cx="280" cy="175" r="51" fill="#d2e0ba" />
        <circle cx="280" cy="175" r="38" fill="#284b38" />
        <text
          x="280"
          y="181"
          fill="#e0eccb"
          fontSize="17"
          textAnchor="middle"
          fontFamily="monospace"
        >
          pplx
        </text>
        <text x="116" y="80" className="graph-label">
          sources
        </text>
        <text x="390" y="75" className="graph-label">
          questions
        </text>
        <text x="123" y="287" className="graph-label">
          knowledge
        </text>
      </svg>
      <span className="art-caption">
        FROM SCATTERED SOURCES TO CONNECTED IDEAS
      </span>
    </div>
  )
}

const workflows = [
  {
    title: 'Research',
    command:
      'perplexity ask "What do I know about retrieval?" --wiki ~/research',
    explanation:
      'Ask with your compiled wiki as context. Bring research back into your own knowledge base.',
    nodes: ['Your question', 'Wiki context', 'Perplexity', 'Research'],
  },
  {
    title: 'Local RAG',
    command: 'perplexity rag "machine learning concepts"',
    explanation:
      'Retrieve from local notes and chats with hybrid vector and keyword search, combined with reciprocal rank fusion.',
    nodes: ['Your query', 'Local sources', 'Hybrid search', 'Context'],
  },
  {
    title: 'Knowledge graph',
    command:
      'perplexity knowledge-graph --dir ~/my-vault --output ~/Desktop/graph.html',
    explanation:
      'Turn the links in a Markdown vault into an interactive graph you can explore offline.',
    nodes: ['Markdown vault', 'Wiki links', 'Graph builder', 'Offline HTML'],
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<ProjectCategory>('All')
  const [workflow, setWorkflow] = useState(0)
  const [repositorySearch, setRepositorySearch] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const activeWorkflow = workflows[workflow]
  const shownProjects = projects.filter(
    (p) => category === 'All' || p.categories.includes(category),
  )
  const shownRepos = repositories.filter((r) =>
    `${r.name} ${r.description ?? ''} ${r.language ?? ''}`
      .toLowerCase()
      .includes(repositorySearch.toLowerCase()),
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 },
    )
    pageRef.current
      ?.querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  async function copyEmail() {
    setCopyError(false)
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <div ref={pageRef}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Arnav Banerjee home">
          ab<span className="brand-flower">✳</span>
        </a>
        <nav
          className={menuOpen ? 'navigation open' : 'navigation'}
          aria-label="Main navigation"
        >
          {[
            ['Work', '#work'],
            ['Approach', '#approach'],
            ['About', '#about'],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href={`mailto:${email}`} className="nav-contact">
            Let's talk <Arrow diagonal />
          </a>
        </nav>
        <a
          href={assetPath('Arnav-Banerjee-Resume.pdf')}
          target="_blank"
          rel="noreferrer"
          className="resume-link"
        >
          Résumé <Arrow diagonal />
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={assetPath('images/solarpunk-orbit.webp')}
            alt="A sculptural metal orbit interwoven with living ferns and moss"
            fetchPriority="high"
            width="1536"
            height="1024"
          />
          <div className="hero-wash" />
          <div className="hero-content">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" /> SOFTWARE ENGINEER · BENGALURU, IN
            </div>
            <h1 id="hero-title">
              Arnav
              <br />
              Banerjee<span className="name-dot">.</span>
            </h1>
            <p className="hero-statement">
              Thoughtful software.
              <br />
              From the inside out.
            </p>
            <p className="hero-description">
              I build reliable systems, useful tools, and interfaces that make
              complex things feel simple.
            </p>
            <a href="#work" className="button button-dark">
              Explore my work <Arrow />
            </a>
          </div>
          <div className="hero-bottom">
            <span>PYTHON / JAVA / INTERFACES / SYSTEMS</span>
            <a href="#work">
              SCROLL TO EXPLORE <span>↓</span>
            </a>
          </div>
        </section>

        <section className="intro section-wrap reveal">
          <div className="eyebrow">
            <span className="section-marker">01</span> A LITTLE CONTEXT
          </div>
          <p>
            Production payments by day.
            <br />
            Open-source possibilities{' '}
            <span className="muted-text">after hours.</span>
          </p>
          <div className="intro-detail">
            I’m a software engineer at Wells Fargo and an independent builder.
            My work moves between backend reliability, developer experience, and
            the interface where it all comes together.
          </div>
        </section>

        <section id="work" className="work-section section-wrap">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow">
                <span className="section-marker">02</span> SELECTED WORK
              </div>
              <h2>Built with intention.</h2>
            </div>
            <span className="section-aside">
              OPEN SOURCE. REAL SYSTEMS.
              <br />
              ALWAYS A WORK IN PROGRESS.
            </span>
          </div>
          <div
            className="project-filters"
            role="group"
            aria-label="Filter selected projects"
          >
            {(
              ['All', 'Python', 'Interfaces', 'Systems'] as ProjectCategory[]
            ).map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={category === item ? 'active' : ''}
              >
                {item}
                {item === 'All' && (
                  <span> {projects.length.toString().padStart(2, '0')}</span>
                )}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {shownProjects.map((project) => (
              <article
                className={`project project-${project.id}`}
                key={project.id}
              >
                <a
                  className="project-visual-link"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <ProjectArt kind={project.kind} />
                  <span className="project-open">
                    <Arrow diagonal />
                  </span>
                </a>
                <div className="project-title-row">
                  <h3>{project.name}</h3>
                  <span className="project-number">/{project.number}</span>
                </div>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <ExternalLink href={project.url}>Source code</ExternalLink>
                  {project.live && (
                    <ExternalLink href={project.live}>
                      Visit project
                    </ExternalLink>
                  )}
                </div>
                <details className="project-details">
                  <summary>
                    Behind the build <span>+</span>
                  </summary>
                  <p>{project.detail}</p>
                </details>
              </article>
            ))}
          </div>

          <details className="repository-directory">
            <summary>
              <span>
                <span className="tiny-orbit">↗</span> There’s more where that
                came from.
              </span>
              <span className="directory-summary">
                Explore {repositories.length} repositories <b>+</b>
              </span>
            </summary>
            <div className="directory-body">
              <div className="directory-top">
                <label htmlFor="repo-search">
                  Find a repository
                  <input
                    type="search"
                    id="repo-search"
                    placeholder="Search a name, language, or idea…"
                    value={repositorySearch}
                    onChange={(e) => setRepositorySearch(e.target.value)}
                  />
                </label>
                <p>
                  Original public repositories on GitHub.
                  <br />
                  Snapshot · October 2026.{' '}
                  <a
                    href={`${github}?tab=repositories`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    See the latest ↗
                  </a>
                </p>
              </div>
              <div className="repo-results" aria-live="polite">
                {shownRepos.length}{' '}
                {shownRepos.length === 1 ? 'repository' : 'repositories'}
              </div>
              <ul className="repo-list">
                {shownRepos.map((repo) => (
                  <li key={repo.name}>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      <span>
                        <strong>{repo.name}</strong>
                        <span className="repo-description">
                          {repo.description ||
                            'Explore the source and project history on GitHub.'}
                        </span>
                      </span>
                      <span className="repo-language">
                        {repo.language || 'Source'}
                        {repo.archived && <small>Archived</small>}
                        <Arrow diagonal />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {shownRepos.length === 0 && (
                <p className="no-results">
                  No repositories match. Try “Python”, “Rust”, or a different
                  name.
                </p>
              )}
            </div>
          </details>
        </section>

        <section className="cli-section" aria-labelledby="cli-title">
          <div className="section-wrap cli-inner">
            <div className="cli-copy reveal">
              <div className="eyebrow">
                <span className="section-marker">03</span> A CLOSER LOOK · PPLX
                CLI
              </div>
              <h2 id="cli-title">
                Small interface.
                <br />
                <span>Deep system.</span>
              </h2>
              <p>
                Research shouldn’t disappear into a chat history. I’m building
                tools that help turn sources into a knowledge base you can
                query, connect, and keep.
              </p>
              <ExternalLink
                href="https://github.com/xerexcoded/pplx-cli"
                className="text-link-light"
              >
                Explore PPLX CLI
              </ExternalLink>
              <div className="cli-footnote">
                PYTHON · LOCAL RETRIEVAL · CONNECTED KNOWLEDGE
              </div>
            </div>
            <div className="cli-demo reveal">
              <div
                className="cli-tabs"
                role="tablist"
                aria-label="PPLX CLI workflows"
              >
                {workflows.map((item, i) => (
                  <button
                    key={item.title}
                    id={`workflow-tab-${i}`}
                    role="tab"
                    aria-selected={workflow === i}
                    aria-controls="workflow-panel"
                    tabIndex={workflow === i ? 0 : -1}
                    onClick={() => setWorkflow(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault()
                        const next =
                          (workflow + (e.key === 'ArrowRight' ? 1 : 2)) % 3
                        setWorkflow(next)
                        document.getElementById(`workflow-tab-${next}`)?.focus()
                      }
                    }}
                    className={workflow === i ? 'active' : ''}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div
                className="cli-window"
                id="workflow-panel"
                role="tabpanel"
                aria-labelledby={`workflow-tab-${workflow}`}
              >
                <div className="cli-window-top">
                  <div className="window-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>~/workspace/pplx-cli</span>
                  <span>COMMAND PREVIEW</span>
                </div>
                <div className="cli-command" key={workflow}>
                  <span className="prompt-symbol">❯</span>
                  <code>{activeWorkflow.command}</code>
                </div>
                <p className="cli-explanation">
                  <span>↳</span>
                  {activeWorkflow.explanation}
                </p>
                <div className="workflow-path">
                  {activeWorkflow.nodes.map((node, i) => (
                    <div key={node}>
                      <span className="workflow-step">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <span>{node}</span>
                      {i < 3 && <Arrow />}
                    </div>
                  ))}
                </div>
                <div className="cli-window-bottom">
                  <span className="status-dot" /> DESIGNED FOR YOUR TERMINAL
                  <span>DOCS → WORKFLOWS</span>
                </div>
              </div>
              <span className="demo-caption">
                An outline of the workflow. Run the commands with PPLX CLI.
              </span>
            </div>
          </div>
        </section>

        <section id="approach" className="approach-section section-wrap">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow">
                <span className="section-marker">04</span> HOW I BUILD
              </div>
              <h2>
                Across the stack.
                <br />
                Close to the problem.
              </h2>
            </div>
            <p className="heading-description">
              A good system is more than its code.
              <br />
              It’s the decisions that make it useful,
              <br />
              reliable, and easy to live with.
            </p>
          </div>
          <div className="capability-list">
            {capabilities.map((item) => (
              <div className="capability reveal" key={item.number}>
                <span className="capability-number">/{item.number}</span>
                <h3>{item.title}</h3>
                <div>
                  <p>{item.description}</p>
                  <span className="capability-stack">{item.stack}</span>
                </div>
                <span className="capability-symbol" aria-hidden="true">
                  {['⌘', '{ }', '◈', '↗'][Number(item.number) - 1]}
                </span>
              </div>
            ))}
          </div>
          <div className="business-note reveal">
            <span className="eyebrow">BUILT FOR PEOPLE, TOO</span>
            <p>
              A clinic scheduler for a 5–6 person team. An inventory app for the
              Andaman Seaweed Company. Small applications where availability,
              reminders, and accurate records make a real difference.
            </p>
            <span className="business-stack">PYTHON / FASTAPI / REACT</span>
          </div>
        </section>

        <section id="about" className="about-section section-wrap">
          <div className="about-intro reveal">
            <div className="eyebrow">
              <span className="section-marker">05</span> THE PERSON BEHIND THE
              CODE
            </div>
            <h2>
              Curious by nature.
              <br />
              Engineer by practice.
            </h2>
            <div className="about-body">
              <p>
                I like the whole journey: understanding a problem, designing the
                system, writing the code, and running it in the real world.
              </p>
              <p>
                At Wells Fargo, that means production financial systems. Outside
                work, it means open-source tools, local AI, small-business
                applications, and a self-managed NixOS server.
              </p>
              <div className="education">
                <span className="eyebrow">FOUNDATIONS</span>
                <strong>B.Tech · Computer Science & Engineering</strong>
                <span>NIT Durgapur · 2019–2023</span>
              </div>
            </div>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-item reveal" key={item.period}>
                <div className="experience-period">{item.period}</div>
                <div>
                  <div className="experience-company">
                    {item.company}
                    <span>{item.team}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                  <div className="experience-highlight">
                    <span>↗</span>
                    {item.highlight}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="recognition reveal">
            <span>RECOGNITION</span>
            <p>
              Manager Spotlight Awards <span>2024 & 2025</span>
            </p>
            <a
              href={assetPath('Arnav-Banerjee-Resume.pdf')}
              download="Arnav-Banerjee-Resume.pdf"
            >
              The full story, in a résumé <Arrow diagonal />
            </a>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="section-wrap contact-inner">
            <div className="contact-top">
              <div className="eyebrow">
                <span className="status-dot" /> GOOD CONVERSATIONS START HERE
              </div>
              <span className="contact-orbit" aria-hidden="true">
                ✳
              </span>
            </div>
            <h2 className="reveal">
              Let’s build
              <br />
              something <em>that matters.</em>
            </h2>
            <div className="contact-bottom">
              <a href={`mailto:${email}`} className="contact-email">
                {email}
                <Arrow diagonal />
              </a>
              <button
                className="copy-email"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? 'Copied ✓' : 'Copy email'}
              </button>
              <span className="copy-status" role="status">
                {copied
                  ? 'Email address copied to clipboard.'
                  : copyError
                    ? 'Select the email address above to copy it.'
                    : ''}
              </span>
              <div className="social-links">
                <ExternalLink href={github}>GitHub</ExternalLink>
                <ExternalLink href="https://www.linkedin.com/in/arnav-banerjee-66b0b5197/">
                  LinkedIn
                </ExternalLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <a href="#" className="footer-wordmark">
          Arnav Banerjee<span>✳</span>
        </a>
        <span>THOUGHTFULLY BUILT. ALWAYS GROWING.</span>
        <a href="#">BACK TO TOP ↑</a>
        <span className="copyright">© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

export default App
