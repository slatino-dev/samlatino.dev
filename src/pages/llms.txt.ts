/**
 * /llms.txt — machine-readable site summary for AI crawlers.
 * Generated from collections: bio, projects (with /projects/<slug>.md links),
 * writing posts (with /writing/<slug>.md links), and meta links.
 *
 * Follows the llms.txt convention (https://llmstxt.org/).
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(_ctx: APIContext) {
  const projects = (await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const posts = (await getCollection('writing')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const lines: string[] = [];

  // ---------------------------------------------------------------------------
  // Header
  // ---------------------------------------------------------------------------
  lines.push('# Sam Latino');
  lines.push('');
  lines.push(
    '> AI engineer building production agent systems, evals, and self-hosted LLM infrastructure — Rust + Python.',
  );
  lines.push('');
  lines.push(
    '> Six open-source projects spanning agent security, MCP protocol implementation, privacy-routing gateways, lexical retrieval, tool-calling conformance, and regression-eval CI. B.S. Biological Engineering, LSU 2020.',
  );
  lines.push('');

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  lines.push('## Projects');
  lines.push('');

  for (const p of projects) {
    const { slug, title, tagline, repo, language, tests } = p.data;
    const mdUrl = `https://samlatino.dev/projects/${slug}.md`;
    const pageUrl = `https://samlatino.dev/projects/${slug}/`;
    lines.push(`- [${title}](${mdUrl}): ${tagline}`);
    lines.push(`  - page: ${pageUrl}`);
    lines.push(`  - repo: ${repo}`);
    lines.push(`  - language: ${language}`);
    if (tests) lines.push(`  - tests: ${tests}`);
    lines.push('');
  }

  // ---------------------------------------------------------------------------
  // Writing
  // ---------------------------------------------------------------------------
  lines.push('## Writing');
  lines.push('');

  for (const post of posts) {
    const { slug, title, date, description } = post.data;
    const isoDate = date.toISOString().slice(0, 10);
    const mdUrl = `https://samlatino.dev/writing/${slug}.md`;
    lines.push(`- [${title}](${mdUrl}) (${isoDate}): ${description}`);
  }

  lines.push('');

  // ---------------------------------------------------------------------------
  // Meta
  // ---------------------------------------------------------------------------
  lines.push('## Meta');
  lines.push('');
  lines.push('- [about](https://samlatino.dev/about.md): Sam Latino — background, education, contact.');
  lines.push('- [resume](https://samlatino.dev/resume/): Full resume; ATS-safe PDF at https://samlatino.dev/resume.pdf');
  lines.push('- [uses](https://samlatino.dev/uses/): Stack, tooling, hardware.');
  lines.push('- [now](https://samlatino.dev/now/): Current focus (updated 2026-06).');
  lines.push('- [RSS feed](https://samlatino.dev/rss.xml): Writing feed.');
  lines.push('- [sitemap](https://samlatino.dev/sitemap-index.xml): Full URL list.');
  lines.push('');
  lines.push('## Identity');
  lines.push('');
  lines.push('- GitHub: https://github.com/slatino-dev');
  lines.push('- Hugging Face: https://huggingface.co/SamLatino');
  lines.push('- LinkedIn: https://www.linkedin.com/in/samlatino');
  lines.push('- Email: latinosammy2@gmail.com');

  const body = lines.join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
