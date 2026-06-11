/**
 * /projects/<slug>.md — raw Markdown twin for each project page.
 * Returns the MDX body as text/plain so AI crawlers and command-line tools
 * can consume project case studies without parsing HTML.
 * The slug.md URL pattern is the convention established in llms.txt.
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

export async function GET({ props }: APIContext) {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<'projects'>>>[number] };
  const { slug, title, tagline, repo, language, status, topics, tests, summary } = entry.data;

  // Build a clean Markdown document from frontmatter + body source.
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`**${tagline}**`);
  lines.push('');
  lines.push(`- **language:** ${language}`);
  lines.push(`- **status:** ${status}`);
  lines.push(`- **repo:** ${repo}`);
  if (tests) lines.push(`- **tests:** ${tests}`);
  if (topics && topics.length > 0) lines.push(`- **topics:** ${topics.join(', ')}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(summary);
  lines.push('');
  // The raw MDX body contains the full case study prose; we return the
  // frontmatter-derived document above since rendering MDX to plain text
  // at build time requires a full render pass. The summary is the authoritative
  // machine-readable description; the HTML page carries the full prose.
  lines.push(`---`);
  lines.push(`Full case study: https://samlatino.dev/projects/${slug}/`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
