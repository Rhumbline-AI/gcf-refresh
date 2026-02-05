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
      name: 'items',
      type: 'array',
      label: 'Points',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
