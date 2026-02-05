import type { Block } from 'payload'

export const Work: Block = {
  slug: 'work',
  labels: {
    singular: 'Work Section',
    plural: 'Work Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'The work',
    },
  ],
}
