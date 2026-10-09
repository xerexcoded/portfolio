export type ProjectCategory = 'All' | 'Python' | 'Interfaces' | 'Systems'
export type Project = {
  id: string
  number: string
  name: string
  subtitle: string
  description: string
  categories: ProjectCategory[]
  tags: string[]
  url: string
  live?: string
  kind: 'terminal' | 'globe' | 'graph' | 'business'
  detail: string
}

export const projects: Project[] = [
  {
    id: 'pplx-cli',
    number: '01',
    name: 'PPLX CLI',
    subtitle: 'A terminal for connected thinking.',
    description:
      'An independent Python CLI for Perplexity and other AI providers. Research, retrieve, and build a source-cited Markdown knowledge base without leaving the terminal.',
    categories: ['Python', 'Systems'],
    tags: ['Python', 'Typer', 'SQLite', 'RAG'],
    url: 'https://github.com/xerexcoded/pplx-cli',
    kind: 'graph',
    detail:
      'I build and maintain the tool end to end: tests, documentation, packaging, releases, and user issue resolution. Local retrieval and connected notes turn research into something you can keep using.',
  },
  {
    id: 'xikoi',
    number: '02',
    name: 'Xikoi',
    subtitle: 'Local intelligence. A quieter interface.',
    description:
      'An early-stage Rust terminal interface for Ollama and llama.cpp, with local voice workflows on Apple Silicon.',
    categories: ['Interfaces', 'Systems'],
    tags: ['Rust', 'Ollama', 'TUI'],
    url: 'https://github.com/xerexcoded/xikoi',
    kind: 'terminal',
    detail:
      'An exploration of systems programming and interface design: a terminal workspace that keeps local model interactions close to the tools developers already use.',
  },
  {
    id: 'ring-of-fire',
    number: '03',
    name: 'Restless Pacific',
    subtitle: 'A world of data, made explorable.',
    description:
      'An interactive Ring of Fire atlas combining an editorial map experience, sourced geospatial data, and embedded analytics.',
    categories: ['Interfaces', 'Systems'],
    tags: ['Next.js', 'PostGIS', 'Clojure', 'Metabase'],
    url: 'https://github.com/xerexcoded/ring-of-fire',
    live: 'https://www.kachal.ai/trivia/ringoffire',
    kind: 'globe',
    detail:
      'From PostgreSQL/PostGIS to a Next.js interface and embedded Metabase analytics. I operate the containerized application on a self-managed NixOS VPS.',
  },
]

export const capabilities = [
  {
    number: '01',
    title: 'Python & data',
    description:
      'Research tools, dependable data workflows, and APIs built for the real world.',
    stack: 'Python · FastAPI · SQLAlchemy · PostgreSQL · RAG',
  },
  {
    number: '02',
    title: 'Java & services',
    description:
      'Transactional systems with clear contracts and predictable failure behavior.',
    stack: 'Java · Spring Boot · Kafka · REST · OpenAPI',
  },
  {
    number: '03',
    title: 'Interfaces & products',
    description:
      'From React applications to terminal interfaces. Useful, considered, and clear.',
    stack: 'React · Next.js · TypeScript · Rust TUI',
  },
  {
    number: '04',
    title: 'Architecture & delivery',
    description:
      'The path from a system design to something observable and running in production.',
    stack: 'Docker · Kubernetes · OpenShift · Helm · NixOS · CI/CD',
  },
]

export const experience = [
  {
    period: '2024 — PRESENT',
    role: 'Software Engineer',
    team: 'Commercial Card Payments',
    company: 'Wells Fargo',
    description:
      'Java/Spring Boot services across commercial-card payments and treasury. Python/SQLAlchemy payment-job migrations with transactional integrity and idempotency.',
    highlight:
      'Modernized a reporting service producing 30,000+ reports daily.',
  },
  {
    period: '2023 — 2024',
    role: 'Program Associate',
    team: 'Full Stack Engineering',
    company: 'Wells Fargo',
    description:
      'Java and React features, Elasticsearch search, Redis caching, and chaos testing across 100+ API endpoints.',
    highlight: 'WiDS 2024: ranked 3rd globally and 1st at Wells Fargo.',
  },
  {
    period: 'JAN — JUL 2023',
    role: 'Intern Analyst',
    team: 'Automation & Data',
    company: 'Wells Fargo',
    description:
      'Migrated Perl automation to Python, built QA test-data tooling, and supported data validation for an Oracle-to-CosmosDB migration.',
    highlight: 'The foundation: practical tooling and careful data validation.',
  },
]
