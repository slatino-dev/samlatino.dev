/**
 * JSON-LD schema builders for samlatino.dev.
 * Generates Person, SoftwareSourceCode, and BlogPosting structured data.
 * All types match schema.org vocabulary; the Person node is injected
 * site-wide via BaseLayout and per-type schemas on project/post pages.
 */

export const SITE_URL = 'https://samlatino.dev';

// ---------------------------------------------------------------------------
// Person — the site author; used as author/creator on every page.
// ---------------------------------------------------------------------------

export function buildPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Sam Latino',
    url: SITE_URL,
    email: 'latinosammy2@gmail.com',
    jobTitle: 'AI Engineer',
    description:
      'AI engineer building production agent systems, evals, and self-hosted LLM infrastructure. B.S. Biological Engineering, LSU 2020.',
    knowsAbout: [
      'AI agent systems',
      'LLM evaluation',
      'self-hosted LLM inference',
      'Rust',
      'Python',
      'TypeScript',
      'BM25 retrieval',
      'vector databases',
      'tool-calling conformance',
      'agent security',
      'OWASP Agentic Top 10',
      'MCP protocol',
      'OpenAI-compatible API routing',
    ],
    sameAs: [
      'https://github.com/slatino-dev',
      'https://www.linkedin.com/in/samlatino',
      'https://huggingface.co/SamLatino',
    ],
  };
}

// ---------------------------------------------------------------------------
// SoftwareSourceCode — one per open-source project.
// ---------------------------------------------------------------------------

interface ProjectSchema {
  name: string;
  description: string;
  url: string;
  repo: string;
  language: string;
  topics?: string[];
}

export function buildSoftwareSourceCode(p: ProjectSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: p.name,
    description: p.description,
    url: p.url,
    codeRepository: p.repo,
    programmingLanguage: p.language,
    author: { '@id': `${SITE_URL}/#person` },
    ...(p.topics && p.topics.length > 0 ? { keywords: p.topics.join(', ') } : {}),
  };
}

// ---------------------------------------------------------------------------
// BlogPosting — one per writing entry.
// ---------------------------------------------------------------------------

interface PostSchema {
  title: string;
  description: string;
  url: string;
  date: Date;
  tags?: string[];
}

export function buildBlogPosting(p: PostSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    url: p.url,
    datePublished: p.date.toISOString().slice(0, 10),
    author: { '@id': `${SITE_URL}/#person` },
    ...(p.tags && p.tags.length > 0 ? { keywords: p.tags.join(', ') } : {}),
  };
}
