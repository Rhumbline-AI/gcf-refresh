import type { Block } from 'payload'

export const Methodology: Block = {
  slug: 'methodology',
  labels: {
    singular: 'Methodology',
    plural: 'Methodologies',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'How do we do it?',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'We engineer combustible ideas.',
    },
    {
      name: 'definition',
      type: 'textarea',
      label: 'Definition Text',
      defaultValue: 'Combustible idea (n.): An idea charged with enough energy, relevance, and emotional spark to spread rapidly.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Methodology Items',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
      ],
    },
  ],
}
