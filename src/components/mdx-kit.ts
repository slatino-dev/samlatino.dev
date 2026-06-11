/**
 * mdx-kit — the component map injected into every MDX body via the
 * `components` prop (see CaseStudyLayout / ProseLayout). Case studies and
 * posts use these without per-file imports, which keeps frontmatter-only
 * stubs and full write-ups on the same rendering path.
 */
import ArchDiagram from './ArchDiagram.astro';
import BenchTable from './BenchTable.astro';
import DeadEnd from './DeadEnd.astro';
import DecisionNote from './DecisionNote.astro';
import Metric from './Metric.astro';
import RepoCta from './RepoCta.astro';
import StatGrid from './StatGrid.astro';
import TerminalCapture from './TerminalCapture.astro';

export const mdxKit = {
  ArchDiagram,
  BenchTable,
  DeadEnd,
  DecisionNote,
  Metric,
  RepoCta,
  StatGrid,
  TerminalCapture,
};
