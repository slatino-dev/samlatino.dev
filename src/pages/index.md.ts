/**
 * /index.md — machine-readable home page summary.
 * Lists all projects and recent writing in plain Markdown.
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
  lines.push('# Sam Latino');
  lines.push('');
  lines.push('AI engineer. Agent systems, evals, and self-hosted LLM infrastructure — Rust + Python.');
  lines.push('');
  lines.push('## Projects');
  lines.push('');

  for (const p of projects) {
    const { slug, title, tagline } = p.data;
    lines.push(`- [${title}](https://samlatino.dev/projects/${slug}/): ${tagline}`);
  }

  lines.push('');
  lines.push('## Writing');
  lines.push('');

  for (const post of posts) {
    const { slug, title, date, description } = post.data;
    const isoDate = date.toISOString().slice(0, 10);
    lines.push(`- [${title}](https://samlatino.dev/writing/${slug}/) (${isoDate}): ${description}`);
  }

  lines.push('');
  lines.push('## Links');
  lines.push('');
  lines.push('- About: https://samlatino.dev/about/');
  lines.push('- GitHub: https://github.com/slatino-dev');
  lines.push('- Hugging Face: https://huggingface.co/SamLatino');
  lines.push('- LinkedIn: https://www.linkedin.com/in/samlatino');
  lines.push('- Email: latinosammy2@gmail.com');
  lines.push('- Machine-readable: https://samlatino.dev/llms.txt');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
