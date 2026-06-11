import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Sam Latino — writing',
    description:
      'Notes on agent systems, evals, and self-hosted LLM infrastructure. Rust + Python.',
    site: context.site ?? 'https://samlatino.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.data.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
