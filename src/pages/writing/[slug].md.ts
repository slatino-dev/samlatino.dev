/**
 * /writing/<slug>.md — raw Markdown twin for each writing post.
 * Returns frontmatter-derived metadata as text/plain. The full HTML post
 * is at /writing/<slug>/; this twin is for AI crawlers and CLI consumers.
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  return posts.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

export async function GET({ props }: APIContext) {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<'writing'>>>[number] };
  const { slug, title, date, description, tags } = entry.data;
  const isoDate = date.toISOString().slice(0, 10);

  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`*Published: ${isoDate}*`);
  if (tags && tags.length > 0) lines.push(`*Tags: ${tags.join(', ')}*`);
  lines.push('');
  lines.push(description);
  lines.push('');
  lines.push('---');
  lines.push(`Full post: https://samlatino.dev/writing/${slug}/`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
