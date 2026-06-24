import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Solid-blue full-width statement module. A single rich-text field is the only
// editable input — keep formatting to bold/italic/underline/link so the visual
// stays consistent with the comp. Headings are intentionally omitted; line
// breaks come from new paragraphs (shift+enter for soft line breaks).
export const BlueStatement: Block = {
  slug: 'blueStatement',
  interfaceName: 'BlueStatementBlock',
  labels: {
    plural: 'Blue Statement Modules',
    singular: 'Blue Statement Module',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Statement Copy',
      editor: lexicalEditor({
        features: () => [
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({ enabledCollections: ['pages', 'posts'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description:
          'Centered statement text on the blue background. Use bold/underline for emphasis; each paragraph becomes its own line.',
      },
    },
  ],
}
