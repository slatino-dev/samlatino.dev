import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * projects — one entry per open-source project. Frontmatter is the single
 * source of truth for everything the cards and case-study headers render;
 * the MDX body is the case study itself.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    /** One-sentence card copy. Truthful, no marketing register. */
    tagline: z.string(),
    /** Full repository URL. */
    repo: z.string().url(),
    /** e.g. "Rust", "Python", "Python + TypeScript". */
    language: z.string(),
    status: z.enum(['active', 'stable', 'experimental', 'archived']),
    /** Sort key for the home-page grid. */
    order: z.number().int(),
    /** Short paragraph for listings and the case-study header. */
    summary: z.string(),
    topics: z.array(z.string()).default([]),
    /** Test count as reported by the project's own suite. Optional, never estimated. */
    tests: z.number().int().positive().optional(),
  }),
});

/**
 * writing — long-form posts. Feed and listing pages read from here.
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, writing };
