// Shiki theme bound to the site's token system. Every color here is one of
// the twelve values declared in src/styles/global.css — code blocks read as
// part of the terminal, not as a third-party widget. Five tones, one accent:
//
//   #101511  surface      block background (matches `pre` chrome)
//   #dce3da  text         default code, identifiers, numbers
//   #96a298  text-muted   punctuation, operators, types, tags
//   #5d6a60  text-faint   comments
//   #3fdf8b  accent       keywords, control flow
//   #2da866  accent-dim   strings
//   #e0734f  delta-bad    diff deletions ONLY (the regression color)

/** @type {import('shiki').ThemeRegistrationRaw} */
const theme = {
  name: 'samlatino-terminal',
  type: 'dark',
  colors: {
    'editor.background': '#101511',
    'editor.foreground': '#dce3da',
  },
  settings: [
    {
      settings: {
        background: '#101511',
        foreground: '#dce3da',
      },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#5d6a60', fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'storage.type',
        'storage.modifier',
        'constant.language',
      ],
      settings: { foreground: '#3fdf8b' },
    },
    {
      scope: [
        'string',
        'string.quoted',
        'punctuation.definition.string',
        'constant.other.symbol',
      ],
      settings: { foreground: '#2da866' },
    },
    {
      scope: [
        'constant.numeric',
        'constant.character',
        'variable',
        'variable.parameter',
        'entity.name.function',
        'support.function',
        'meta.function-call',
      ],
      settings: { foreground: '#dce3da' },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.namespace',
        'support.type',
        'support.class',
        'entity.name.tag',
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#96a298' },
    },
    {
      scope: ['punctuation', 'keyword.operator', 'meta.brace'],
      settings: { foreground: '#96a298' },
    },
    {
      // Property keys in data formats (JSON/YAML/TOML) — muted, values carry.
      scope: [
        'support.type.property-name',
        'entity.name.tag.yaml',
        'keyword.key.toml',
      ],
      settings: { foreground: '#96a298' },
    },
    {
      // Diff deletions: the ONLY non-table use of the regression hue, and it
      // marks the same thing — something got worse / went away.
      scope: ['markup.deleted'],
      settings: { foreground: '#e0734f' },
    },
    {
      scope: ['markup.inserted'],
      settings: { foreground: '#3fdf8b' },
    },
    {
      scope: ['markup.heading'],
      settings: { foreground: '#dce3da', fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
  ],
};

export default theme;
