/**
 * /robots.txt — allow all crawlers; explicit Allow for major AI crawlers;
 * Sitemap line so bots can find the full URL list.
 */
import type { APIContext } from 'astro';

export async function GET(_ctx: APIContext) {
  const body = `User-agent: *
Allow: /

# AI crawlers — explicitly welcome; the site is designed to be machine-readable.
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://samlatino.dev/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
