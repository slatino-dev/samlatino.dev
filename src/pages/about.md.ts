/**
 * /about.md — machine-readable about page.
 * Plain Markdown for AI crawlers; the HTML version is at /about/.
 */
import type { APIContext } from 'astro';

export async function GET(_ctx: APIContext) {
  const body = `# Sam Latino — About

AI engineer building production agent systems, evals, and self-hosted LLM infrastructure.

## Background

- B.S. Biological Engineering, Louisiana State University (2016–2020)
- Several years in enterprise software sales before moving full-time into engineering
- Building production AI/LLM systems since 2023
- Self-hosted GPU inference: Qwen models served via vLLM

## What I build

- **Agent systems** — orchestration harnesses, permission models, tool-call routing, multi-round-trip flows
- **Evals** — deterministic oracles, noise-floor drift detection, reproducible bench harnesses
- **Self-hosted inference** — local GPU servers, vLLM, LiteLLM routing, privacy-enforcing gateways

## Open-source projects (2026)

1. redcell (Python) — agent robustness testing, OWASP Agentic Top 10, 146 probes, 132 tests
2. longhaul (Rust) — MCP 2026-07-28 RC server, Tasks extension, stateless core, 67 tests
3. patchbay (Rust) — OpenAI-compatible gateway, type-system privacy routing, 13 tests
4. millstone (Rust) — BM25 + tree-sitter retrieval crate, bench harness vs tantivy/FTS5, 35 tests
5. callcheck (Python) — tool-calling conformance matrix, 11-label taxonomy, mockserver, 165 tests
6. eval-gate (Python + TypeScript) — CI eval gate, embedding-free scorers, GitHub Action, 112 tests

## Contact

- email: latinosammy2@gmail.com
- github: https://github.com/slatino-dev
- huggingface: https://huggingface.co/SamLatino
- linkedin: https://www.linkedin.com/in/samlatino

---

Full about page: https://samlatino.dev/about/
Machine-readable site index: https://samlatino.dev/llms.txt
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
